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
 * Constructs an SQL query for searching exercises based on optional search strings and filter criteria.
 *
 * This function dynamically generates a complex SQL query utilizing Common Table Expressions (CTEs)
 * for exercises, equipment aggregations, and body part aggregations. It supports filtering exercises
 * by names, equipment, and muscle groups, including specific muscles. The core logic involves building
 * SQL queries for each CTE based on the given filters and search string, and then constructing a final
 * query that selects exercises satisfying these conditions. This approach allows for flexible and efficient
 * data retrieval from a relational database structure, especially useful in fitness or workout tracking applications
 * where complex queries are common.
 *
 * @param {string} [searchString] - Optional search string for filtering exercises by name.
 * @param {ExerciseSearchFiltersSchema} [filters] - Optional filter criteria including equipment, muscle groups, and specific muscles.
 * @returns {string} An SQL query string that can be executed to retrieve filtered exercise data.
 */
export const getExerciseSearchQuery = (
  searchString?: string,
  filters?: ExerciseSearchFiltersSchema,
): string => {
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
      `COUNT(DISTINCT(${otherDbTables.bodypart}.specific_muscle)) as specific_muscle_count`,
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
      ...(filters?.muscleGroups && !filters?.specificMuscles
        ? {
            [`${otherDbTables.bodypart}.muscle_group`]: {
              [BaseOperators.In]: filters.muscleGroups,
            },
          }
        : {}),
      ...(filters?.specificMuscles && !filters.muscleGroups
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
    if (!filters?.specificMuscles) {
      selectWhereConditions.muscle_group_count = {
        [BaseOperators.Eq]: filters.muscleGroups.length,
      };
    } else {
      selectWhereConditions[`${bodypartAggCteName}.muscle_group`] = {
        [StringOperators.Like]: filters.muscleGroups,
      };
    }
  }
  if (filters?.specificMuscles) {
    if (!filters?.muscleGroups) {
      selectWhereConditions.specific_muscle_count = {
        [BaseOperators.Eq]: filters.specificMuscles.length,
      };
    } else {
      selectWhereConditions[`${bodypartAggCteName}.specific_muscle`] = {
        [StringOperators.Like]: filters.specificMuscles,
      };
    }
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
 * Performs a search for exercises based on a given search string and filter criteria.
 *
 * This asynchronous function initiates a search for exercises using optional search strings and filters,
 * executing a SQL query to retrieve relevant data. It processes the search results to compile a list of exercises
 * along with associated equipment, muscle groups, and specific muscles. The function handles errors gracefully,
 * logging them and returning null if the SQL execution fails. On successful retrieval, it constructs a structured
 * response including the search results and deduplicated lists of equipment, muscle groups, and specific muscles.
 * This function is useful in applications requiring complex data retrieval for fitness or workout planning,
 * providing a comprehensive search capability with detailed results.
 *
 * @param {string} [searchString] - Optional search string for filtering exercises by name.
 * @param {ExerciseSearchFiltersSchema} [filters] - Optional filter criteria including equipment, muscle groups, and specific muscles.
 * @returns {Promise<SearchFuncResponse | null>} A promise that resolves to a structured search response object or null in case of an error.
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
  const equipments = Array.from(equipmentSet).sort();
  const muscleGroups = Array.from(muscleGroupSet).sort();
  const specificMuscles = Array.from(specificMuscleSet).sort();

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
