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
import {ExerciseSearchFilters} from '@services/db/exercise/Types';
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
  filters?: Partial<Record<ExerciseSearchFilters, Array<string>>>,
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

  const specificMuscleCteName = 'specific_muscle_agg';
  const specificMuscleCte = buildSqlQuery({
    table: otherDbTables.specificMuscle,
    selectColumns: [
      `${syncDbTables.exerciseSpecificMuscle}.exercise_id`,
      `${otherDbTables.specificMuscle}.sub_muscle_group_id`,
      `${otherDbTables.specificMuscle}.name as specific_muscle`,
    ],
    joins: {
      [syncDbTables.exerciseSpecificMuscle]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.exerciseSpecificMuscle}.specific_muscle_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${otherDbTables.specificMuscle}.specific_muscle_id`,
            },
          },
        },
      },
    },
    whereConditions: {
      [`${syncDbTables.exerciseSpecificMuscle}.exercise_id`]: {
        [BaseOperators.In]: {
          isLiteral: true,
          value: `(SELECT exercise_id FROM ${exerciseCteName})`,
        },
      },
      ...(filters?.specificMuscles &&
      !filters.muscleGroups &&
      !filters.subMuscleGroups
        ? {
            [`${otherDbTables.specificMuscle}.name`]: {
              [BaseOperators.In]: filters.specificMuscles,
            },
          }
        : {}),
    },
  });

  const subMuscleGroupCteName = 'sub_muscle_group_agg';
  const subMuscleGroupCte = buildSqlQuery({
    table: otherDbTables.subMuscleGroup,
    selectColumns: [
      `${otherDbTables.subMuscleGroup}.muscle_group_id`,
      `${otherDbTables.subMuscleGroup}.name as sub_muscle_group`,
      `${specificMuscleCteName}.specific_muscle`,
      `${specificMuscleCteName}.exercise_id`,
    ],
    joins: {
      [specificMuscleCteName]: {
        join: JoinOperators.INNER,
        on: {
          [`${otherDbTables.subMuscleGroup}.sub_muscle_group_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${specificMuscleCteName}.sub_muscle_group_id`,
            },
          },
        },
      },
    },
    whereConditions: {
      ...(filters?.subMuscleGroups &&
      !filters?.muscleGroups &&
      !filters?.specificMuscles
        ? {
            [`${otherDbTables.subMuscleGroup}.name`]: {
              [BaseOperators.In]: filters.subMuscleGroups,
            },
          }
        : {}),
    },
  });

  const muscleGroupCteName = 'muscle_group_agg';
  const muscleGroupCte = buildSqlQuery({
    table: otherDbTables.muscleGroup,
    selectColumns: [
      // Muscle Group Fields
      `GROUP_CONCAT(${otherDbTables.muscleGroup}.name, ';') as muscle_group`,
      `COUNT(DISTINCT(${otherDbTables.muscleGroup}.name)) as muscle_group_count`,
      // Sub Muscle Group Fields
      `GROUP_CONCAT(${subMuscleGroupCteName}.sub_muscle_group, ';') as sub_muscle_group`,
      `COUNT(DISTINCT(${subMuscleGroupCteName}.sub_muscle_group)) as sub_muscle_group_count`,
      // Specific Muscle Fields
      `GROUP_CONCAT(${subMuscleGroupCteName}.specific_muscle, ';') as specific_muscle`,
      `COUNT(DISTINCT(${subMuscleGroupCteName}.specific_muscle)) as specific_muscle_count`,
      // Exercise Id
      `${subMuscleGroupCteName}.exercise_id`,
    ],
    joins: {
      [subMuscleGroupCteName]: {
        join: JoinOperators.INNER,
        on: {
          [`${subMuscleGroupCteName}.muscle_group_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${otherDbTables.muscleGroup}.muscle_group_id`,
            },
          },
        },
      },
    },
    whereConditions: {
      ...(filters?.muscleGroups &&
      !filters.specificMuscles &&
      !filters.subMuscleGroups
        ? {
            [`${otherDbTables.muscleGroup}.name`]: {
              [BaseOperators.In]: filters.muscleGroups,
            },
          }
        : {}),
    },
    groupby: ['exercise_id'],
  });

  const selectWhereConditions: Record<string, any> = {};
  if (filters?.equipments) {
    selectWhereConditions.equipment_count = {
      [BaseOperators.Eq]: filters.equipments.length,
    };
  }
  if (filters?.muscleGroups) {
    if (!filters?.specificMuscles && !filters.subMuscleGroups) {
      selectWhereConditions.muscle_group_count = {
        [BaseOperators.Eq]: filters.muscleGroups.length,
      };
    } else {
      selectWhereConditions[`${muscleGroupCteName}.muscle_group`] = {
        [StringOperators.Like]: filters.muscleGroups,
      };
    }
  }
  if (filters?.specificMuscles) {
    if (!filters?.muscleGroups && !filters.subMuscleGroups) {
      selectWhereConditions.specific_muscle_count = {
        [BaseOperators.Eq]: filters.specificMuscles.length,
      };
    } else {
      selectWhereConditions[`${muscleGroupCteName}.specific_muscle`] = {
        [StringOperators.Like]: filters.specificMuscles,
      };
    }
  }
  if (filters?.subMuscleGroups) {
    if (!filters?.muscleGroups && !filters.specificMuscles) {
      selectWhereConditions.sub_muscle_group_count = {
        [BaseOperators.Eq]: filters.subMuscleGroups.length,
      };
    } else {
      selectWhereConditions[`${muscleGroupCteName}.sub_muscle_group`] = {
        [StringOperators.Like]: filters.subMuscleGroups,
      };
    }
  }

  const selectQuery = buildSqlQuery({
    table: exerciseCteName,
    selectColumns: [
      `${exerciseCteName}.exercise_id`,
      `${exerciseCteName}.exercise_name`,
      `${equipmentAggCteName}.equipment_name`,
      `${muscleGroupCteName}.muscle_group`,
      `${muscleGroupCteName}.sub_muscle_group`,
      `${muscleGroupCteName}.specific_muscle`,
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
        name: specificMuscleCteName,
        value: specificMuscleCte,
      },
      {
        name: subMuscleGroupCteName,
        value: subMuscleGroupCte,
      },
      {
        name: muscleGroupCteName,
        value: muscleGroupCte,
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
      [muscleGroupCteName]: {
        join: JoinOperators.INNER,
        on: {
          [`${muscleGroupCteName}.exercise_id`]: {
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
  filters?: Partial<Record<ExerciseSearchFilters, Array<string>>>,
): Promise<SearchFuncResponse | null> => {
  const startTime = new Date().getTime();

  const exerciseSearchQuery = getExerciseSearchQuery(searchString, filters);
  const response = await executeSqlBatch<ExerciseSearchResponse>([
    {sqlStatement: exerciseSearchQuery},
  ]);

  if (response[0].error) {
    logger.error(
      `(function)=(exerciseSearch);${
        searchString ? `(searchString)=(${searchString})` : ''
      } ` + `- error recieved '${response[0].error}'`,
    );
    return null;
  }

  const result = response[0].result;

  const exercises: SearchResults[] = [];
  const equipmentSet = new Set<string>();
  const muscleGroupSet = new Set<string>();
  const subMuscleGroupSet = new Set<string>();
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
    exerciseObj.sub_muscle_group
      .split(';')
      .filter(Boolean)
      .forEach(smg => subMuscleGroupSet.add(smg));
    exerciseObj.specific_muscle
      .split(';')
      .filter(Boolean)
      .forEach(sm => specificMuscleSet.add(sm));
  }

  // If you need to work with arrays instead of sets later in your code
  const equipments = Array.from(equipmentSet).sort();
  const muscleGroups = Array.from(muscleGroupSet).sort();
  const subMuscleGroups = Array.from(subMuscleGroupSet).sort();
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
      subMuscleGroups: {
        label: 'Sub Muscle Groups',
        values: subMuscleGroups,
      },
      specificMuscles: {
        label: 'Specific Muscles',
        values: specificMuscles,
      },
    },
  };
};
