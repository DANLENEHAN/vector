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

export const exerciseSearch = async (
  searchString?: string,
  filters?: ExerciseSearchFiltersSchema,
): Promise<SearchFuncResponse | null> => {
  const startTime = new Date().getTime();
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

  const response = await executeSqlBatch<ExerciseSearchResponse>([
    {sqlStatement: selectQuery},
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
    filters: {equipments, muscleGroups, specificMuscles},
  };
};
