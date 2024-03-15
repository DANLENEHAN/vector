// Constants
import {otherDbTables, syncDbTables} from '@shared/Constants';
import {JoinOperators} from '@services/db/Constants';
import {ExerciseSearchResponse} from '@services/api/swagger/data-contracts';

// Functions
import {buildSqlQuery} from '@services/db/Functions';
import {
  BaseOperators,
  StringOperators,
} from '@services/api/swagger/data-contracts';
import {executeSqlBatch} from '../SqlClient';

// Types
import {ExerciseSearchFiltersSchema} from '@services/db/exercise/Types';
import {SearchResults, SearchFuncResponse} from '@components/search/Types';

// Services
import logger from '@utils/Logger';

/**
 * Generates a SQL query for searching exercises based on optional search strings and filter criteria.
 * The function constructs complex SQL queries using common table expressions (CTEs) to aggregate information about
 * exercises, equipment used, and body parts targeted. It supports filtering exercises by name, equipment, muscle groups,
 * and specific muscles. The final query returns detailed information about each exercise, including its name, associated
 * equipment, and muscle groups targeted.
 *
 * The query construction process involves three main CTEs:
 * 1. `exercises` CTE, which selects exercise names and IDs based on the search string.
 * 2. `equipment_agg` CTE, which aggregates equipment names and counts per exercise, applying equipment filters if provided.
 * 3. `bodypart_agg` CTE, which aggregates body part names and counts per exercise, applying muscle group and specific muscle filters if provided.
 *
 * The final selection joins these CTEs to compile a comprehensive list of exercises along with their equipment and targeted body parts,
 * applying additional filters based on the counts of equipment, muscle groups, and specific muscles to match the lengths of the filter arrays.
 *
 * @param {string} [searchString] - Optional. The search string to filter exercises by name.
 * @param {ExerciseSearchFiltersSchema} [filters] - Optional. An object containing arrays of strings for equipment, muscle groups, and specific muscles to filter the exercises.
 * @returns {string} A SQL query string that can be executed to retrieve the filtered list of exercises with their associated equipment and targeted body parts.
 */
export const getExerciseSearchQuery = (
  searchString?: string,
  filters?: ExerciseSearchFiltersSchema,
) => {
  const exerciseCteName = 'exercises';
  const exerciseCteSql = buildSqlQuery({
    table: syncDbTables.exercise,
    selectColumns: [
      `${syncDbTables.exercise}.name as ${syncDbTables.exercise}_name`,
      `${syncDbTables.exercise}.exercise_id`,
    ],
    whereConditions: searchString
      ? {
          name: {[StringOperators.Like]: searchString},
        }
      : {},
  });

  const equipmentAggCteName = 'equipment_agg';
  const equipmentAggCte = buildSqlQuery({
    table: syncDbTables.equipment,
    selectColumns: [
      `${syncDbTables.exerciseEquipment}.exercise_id`,
      `GROUP_CONCAT(${syncDbTables.equipment}.name, ';') as equipment_name`,
      `COUNT(DISTINCT(${syncDbTables.equipment}.name)) as equipment_count`,
    ],
    joins: {
      [syncDbTables.exerciseEquipment]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.exerciseEquipment}.equipment_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${syncDbTables.equipment}.equipment_id`,
            },
          },
        },
      },
    },
    whereConditions: {
      [`${syncDbTables.exerciseEquipment}.exercise_id`]: {
        [BaseOperators.In]: {
          isLiteral: true,
          value: `(SELECT exercise_id FROM ${exerciseCteName})`,
        },
      },
      ...(filters?.equipments
        ? {
            [`${syncDbTables.equipment}.name`]: {
              [BaseOperators.In]: filters.equipments,
            },
          }
        : {}),
    },
    groupby: [`${syncDbTables.exerciseEquipment}.exercise_id`],
  });

  const bodypartAggCteName = 'bodypart_agg';
  const bodypartAggCte = buildSqlQuery({
    table: otherDbTables.bodypart,
    selectColumns: [
      `${syncDbTables.exerciseBodypart}.exercise_id`,
      `GROUP_CONCAT(${otherDbTables.bodypart}.muscle_group, ';') as muscle_group`,
      `GROUP_CONCAT(${otherDbTables.bodypart}.specific_muscle, ';') as specific_muscle`,
      `COUNT(DISTINCT(${otherDbTables.bodypart}.muscle_group)) as muscle_group_count`,
      `COUNT(DISTINCT(${otherDbTables.bodypart}.muscle_group)) as specific_muscle_count`,
    ],
    joins: {
      [syncDbTables.exerciseBodypart]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.exerciseBodypart}.bodypart_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${otherDbTables.bodypart}.bodypart_id`,
            },
          },
        },
      },
    },
    whereConditions: {
      [`${syncDbTables.exerciseBodypart}.exercise_id`]: {
        [BaseOperators.In]: {
          isLiteral: true,
          value: `(SELECT exercise_id FROM ${exerciseCteName})`,
        },
      },
      ...(filters?.muscleGroups
        ? {
            [`${otherDbTables.bodypart}.muscle_group`]: {
              [BaseOperators.In]: filters.muscleGroups,
            },
          }
        : {}),
      ...(filters?.specificMuscles
        ? {
            [`${otherDbTables.bodypart}.specific_muscle`]: {
              [BaseOperators.In]: filters.specificMuscles,
            },
          }
        : {}),
    },
    groupby: [`${syncDbTables.exerciseBodypart}.exercise_id`],
  });

  const selectWhereConditions: Record<string, any> = {};
  if (filters?.equipments) {
    selectWhereConditions.equipment_count = {
      [BaseOperators.Eq]: filters.equipments.length,
    };
  }
  if (filters?.muscleGroups) {
    selectWhereConditions.muscle_group_count = {
      [BaseOperators.Eq]: filters.muscleGroups.length,
    };
  }
  if (filters?.specificMuscles) {
    selectWhereConditions.specific_muscle_count = {
      [BaseOperators.Eq]: filters.specificMuscles.length,
    };
  }

  const selectQuery = buildSqlQuery({
    table: exerciseCteName,
    selectColumns: [
      `${exerciseCteName}.exercise_id`,
      `${exerciseCteName}.exercise_name`,
      `${equipmentAggCteName}.equipment_name`,
      `${bodypartAggCteName}.muscle_group`,
      `${bodypartAggCteName}.specific_muscle`,
    ],
    ctes: [
      {
        name: exerciseCteName,
        value: exerciseCteSql,
      },
      {
        name: equipmentAggCteName,
        value: equipmentAggCte,
      },
      {
        name: bodypartAggCteName,
        value: bodypartAggCte,
      },
    ],
    joins: {
      [equipmentAggCteName]: {
        join: JoinOperators.INNER,
        on: {
          [`${equipmentAggCteName}.exercise_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${exerciseCteName}.exercise_id`,
            },
          },
        },
      },
      [bodypartAggCteName]: {
        join: JoinOperators.INNER,
        on: {
          [`${bodypartAggCteName}.exercise_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${exerciseCteName}.exercise_id`,
            },
          },
        },
      },
    },
    whereConditions: selectWhereConditions,
  });
  return selectQuery;
};

/**
 * Executes a search for exercises based on a given search string and filter criteria, returning structured search results
 * and aggregated filters for equipment, muscle groups, and specific muscles. This function leverages `getExerciseSearchQuery`
 * to construct a complex SQL query, which is then executed to fetch matching exercises. The results are processed to
 * compile a list of unique exercises and aggregate the equipment, muscle groups, and specific muscles associated with them.
 *
 * If the SQL query execution encounters an error, the function logs the error and returns `null` to indicate failure.
 * Otherwise, it returns an object containing the search results and aggregated filters, which include unique lists of
 * equipment, muscle groups, and specific muscles that are involved in the returned exercises. This allows for efficient
 * front-end rendering or further processing of the search results and the dynamic generation of filter options based on
 * the search output.
 *
 * The function also logs the execution time, helping with performance monitoring.
 *
 * @param {string} [searchString] - Optional. The search string to filter exercises by their names.
 * @param {ExerciseSearchFiltersSchema} [filters] - Optional. Filter criteria including arrays of strings for equipment, muscle groups, and specific muscles.
 * @returns {Promise<SearchFuncResponse | null>} A promise that resolves to the search results and aggregated filters, or `null` if an error occurs during the SQL query execution.
 */
export const exerciseSearch = async (
  searchString?: string,
  filters?: ExerciseSearchFiltersSchema,
): Promise<SearchFuncResponse | null> => {
  const startTime = new Date().getTime();

  const exerciseSearchQuery = getExerciseSearchQuery(searchString, filters);
  const response = await executeSqlBatch<ExerciseSearchResponse>([
    {sqlStatement: exerciseSearchQuery},
  ]);

  if (response[0].error) {
    logger.error(
      `(function)=(exerciseSearch);(exerciseSubStr)=(${searchString}) ` +
        `- error ${response[0].error}`,
    );
    return null;
  }

  const result = response[0].result;

  const exercises: SearchResults[] = [];
  const equipmentSet = new Set<string>();
  const muscleGroupSet = new Set<string>();
  const specificMuscleSet = new Set<string>();

  for (const exerciseObj of result) {
    exercises.push({
      itemId: exerciseObj.exercise_id,
      itemName: exerciseObj.exercise_name,
    });

    // Split the string, then add each item to the set to avoid duplicates
    exerciseObj.equipment_name
      .split(';')
      .filter(Boolean)
      .forEach(e => equipmentSet.add(e));
    exerciseObj.muscle_group
      .split(';')
      .filter(Boolean)
      .forEach(mg => muscleGroupSet.add(mg));
    exerciseObj.specific_muscle
      .split(';')
      .filter(Boolean)
      .forEach(sm => specificMuscleSet.add(sm));
  }

  // If you need to work with arrays instead of sets later in your code
  const equipments = Array.from(equipmentSet);
  const muscleGroups = Array.from(muscleGroupSet);
  const specificMuscles = Array.from(specificMuscleSet);

  const endTime = new Date().getTime();
  logger.info(
    '(function)=(exerciseSearch);' + ` - took ${endTime - startTime}ms`,
  );
  return {
    searchResults: exercises,
    filters: {
      equipments: {
        label: 'Equipment',
        values: equipments,
      },
      muscleGroups: {
        label: 'Muscle Groups',
        values: muscleGroups,
      },
      specificMuscles: {
        label: 'Specific Muscles',
        values: specificMuscles,
      },
    },
  };
};
