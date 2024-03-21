// Functions
import {
  getExerciseSearchQuery,
  exerciseSearch,
} from '@services/db/exercise/Functions';
import * as SqlClientFunctions from '@services/db/SqlClient';

// Services
import logger from '@utils/Logger';

describe('Exercise DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const exerciseSearchQueryNoFilters =
    'WITH exercises as (SELECT exercise.name as exercise_name, exercise.exercise_id FROM exercise), ' +
    "equipment_agg AS (SELECT exercise_equipment.exercise_id, GROUP_CONCAT(equipment.name, ';') as equipment_name, " +
    'COUNT(DISTINCT(equipment.name)) as equipment_count FROM equipment INNER JOIN exercise_equipment ON ' +
    '(exercise_equipment.equipment_id = equipment.equipment_id) ' +
    // Filters (1)
    'WHERE (exercise_equipment.exercise_id IN ' +
    '(SELECT exercise_id FROM exercises)) GROUP BY exercise_equipment.exercise_id), bodypart_agg AS (SELECT ' +
    "exercise_bodypart.exercise_id, GROUP_CONCAT(bodypart.muscle_group, ';') as muscle_group, " +
    "GROUP_CONCAT(bodypart.specific_muscle, ';') as specific_muscle, COUNT(DISTINCT(bodypart.muscle_group)) " +
    'as muscle_group_count, COUNT(DISTINCT(bodypart.specific_muscle)) as specific_muscle_count FROM bodypart INNER ' +
    'JOIN exercise_bodypart ON (exercise_bodypart.bodypart_id = bodypart.bodypart_id) ' +
    // Filters (2)
    'WHERE (exercise_bodypart.exercise_id ' +
    'IN (SELECT exercise_id FROM exercises)) GROUP BY exercise_bodypart.exercise_id) SELECT exercises.exercise_id, ' +
    'exercises.exercise_name, equipment_agg.equipment_name, bodypart_agg.muscle_group, bodypart_agg.specific_muscle FROM ' +
    'exercises INNER JOIN equipment_agg ON (equipment_agg.exercise_id = exercises.exercise_id) INNER JOIN bodypart_agg ON ' +
    '(bodypart_agg.exercise_id = exercises.exercise_id)';

  const exerciseSearchResponse = [
    {
      equipment_name: 'Barbell',
      exercise_id: '61697437-3060-49c8-ac07-557433dc6d83',
      exercise_name: 'Barbell guillotine bench press',
      muscle_group: 'Chest;Chest;Shoulders;Triceps;Triceps',
      specific_muscle:
        'Pectoralis Major (Clavicular Head);Pectoralis Major (Sternal Head);Anterior Deltoid;Triceps Brachii (Long Head);Triceps Brachii (Medial Head)',
    },
    {
      equipment_name: 'Barbell',
      exercise_id: '68768f7d-b069-44e4-9575-71fe53076eac',
      exercise_name: 'Barbell incline bench press medium-grip',
      muscle_group: 'Chest;Chest;Shoulders;Triceps;Triceps',
      specific_muscle:
        'Pectoralis Major (Clavicular Head);Pectoralis Major (Sternal Head);Anterior Deltoid;Triceps Brachii (Long Head);Triceps Brachii (Medial Head)',
    },
    {
      equipment_name: 'Barbell',
      exercise_id: 'ed467adc-1ca5-4010-ac65-204ccf4ac1b5',
      exercise_name: 'Barbell incline bench press - medium grip',
      muscle_group: 'Chest;Chest;Shoulders;Triceps;Triceps',
      specific_muscle:
        'Pectoralis Major (Clavicular Head);Pectoralis Major (Sternal Head);Anterior Deltoid;Triceps Brachii (Long Head);Triceps Brachii (Medial Head)',
    },
  ];

  test('getExerciseSearchQuery - no filters', () => {
    // Arrange
    // Act
    const response = getExerciseSearchQuery();
    // Assert
    expect(response).toEqual(exerciseSearchQueryNoFilters);
  });

  test('getExerciseSearchQuery - search string value for all filters', () => {
    // Arrange
    const searchString = 'bench press';
    const filters = {
      equipments: ['Barbell'],
      muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
      specificMuscles: ['Pectoralis Major (Clavicular Head)'],
    };
    const sqlResultString =
      'WITH exercises as (SELECT exercise.name as exercise_name, exercise.exercise_id ' +
      // Filters (1)
      "FROM exercise WHERE (name LIKE '%bench press%')), equipment_agg AS " +
      "(SELECT exercise_equipment.exercise_id, GROUP_CONCAT(equipment.name, ';') " +
      'as equipment_name, COUNT(DISTINCT(equipment.name)) as equipment_count FROM ' +
      'equipment INNER JOIN exercise_equipment ON (exercise_equipment.equipment_id = ' +
      // Filters (2)
      'equipment.equipment_id) WHERE (exercise_equipment.exercise_id IN (SELECT exercise_id ' +
      "FROM exercises) and equipment.name IN ('Barbell')) GROUP BY exercise_equipment.exercise_id), " +
      "bodypart_agg AS (SELECT exercise_bodypart.exercise_id, GROUP_CONCAT(bodypart.muscle_group, ';') " +
      "as muscle_group, GROUP_CONCAT(bodypart.specific_muscle, ';') as specific_muscle, " +
      'COUNT(DISTINCT(bodypart.muscle_group)) as muscle_group_count, ' +
      'COUNT(DISTINCT(bodypart.specific_muscle)) as specific_muscle_count FROM bodypart ' +
      'INNER JOIN exercise_bodypart ON (exercise_bodypart.bodypart_id = bodypart.bodypart_id) ' +
      // Filters (3)
      'WHERE (exercise_bodypart.exercise_id IN (SELECT exercise_id FROM exercises)) GROUP BY ' +
      'exercise_bodypart.exercise_id) SELECT exercises.exercise_id, exercises.exercise_name, ' +
      'equipment_agg.equipment_name, bodypart_agg.muscle_group, bodypart_agg.specific_muscle FROM ' +
      'exercises INNER JOIN equipment_agg ON (equipment_agg.exercise_id = exercises.exercise_id) INNER ' +
      'JOIN bodypart_agg ON (bodypart_agg.exercise_id = exercises.exercise_id) ' +
      // Filters (4)
      'WHERE (equipment_count = 1 ' +
      "and bodypart_agg.muscle_group LIKE '%Chest%' and bodypart_agg.muscle_group LIKE '%Shoulders%' and " +
      "bodypart_agg.muscle_group LIKE '%Triceps%' and bodypart_agg.specific_muscle LIKE '%Pectoralis Major " +
      "(Clavicular Head)%')";
    // Act
    const response = getExerciseSearchQuery(searchString, filters);
    // Assert
    expect(response).toEqual(sqlResultString);
  });

  test('getExerciseSearchQuery - search string and equipment muscle group filters ', () => {
    // Arrange
    const searchString = 'bench press';
    const filters = {
      equipments: ['Barbell'],
      muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    } as any;
    const sqlResultString =
      'WITH exercises as (SELECT exercise.name as exercise_name, exercise.exercise_id FROM exercise ' +
      // Filters (1)
      "WHERE (name LIKE '%bench press%')), equipment_agg AS (SELECT exercise_equipment.exercise_id, " +
      "GROUP_CONCAT(equipment.name, ';') as equipment_name, COUNT(DISTINCT(equipment.name)) as equipment_count " +
      'FROM equipment INNER JOIN exercise_equipment ON (exercise_equipment.equipment_id = equipment.equipment_id) ' +
      // Filters (2)
      "WHERE (exercise_equipment.exercise_id IN (SELECT exercise_id FROM exercises) and equipment.name IN ('Barbell')) " +
      'GROUP BY exercise_equipment.exercise_id), bodypart_agg AS (SELECT exercise_bodypart.exercise_id, ' +
      "GROUP_CONCAT(bodypart.muscle_group, ';') as muscle_group, GROUP_CONCAT(bodypart.specific_muscle, ';') as " +
      'specific_muscle, COUNT(DISTINCT(bodypart.muscle_group)) as muscle_group_count, COUNT(DISTINCT(bodypart.specific_muscle)) ' +
      'as specific_muscle_count FROM bodypart INNER JOIN exercise_bodypart ON (exercise_bodypart.bodypart_id = bodypart.bodypart_id) ' +
      // Filters (3)
      "WHERE (exercise_bodypart.exercise_id IN (SELECT exercise_id FROM exercises) and bodypart.muscle_group IN ('Chest', 'Shoulders', " +
      "'Triceps')) GROUP BY exercise_bodypart.exercise_id) SELECT exercises.exercise_id, exercises.exercise_name, " +
      'equipment_agg.equipment_name, bodypart_agg.muscle_group, bodypart_agg.specific_muscle FROM exercises INNER JOIN ' +
      'equipment_agg ON (equipment_agg.exercise_id = exercises.exercise_id) INNER JOIN bodypart_agg ON ' +
      '(bodypart_agg.exercise_id = exercises.exercise_id) ' +
      // Filters (4)
      'WHERE (equipment_count = 1 and muscle_group_count = 3)';
    // Act
    const response = getExerciseSearchQuery(searchString, filters);
    // Assert
    expect(response).toEqual(sqlResultString);
  });

  test('exerciseSearch', async () => {
    // Arrange
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: exerciseSearchQueryNoFilters,
          },
          result: exerciseSearchResponse,
          error: null,
        },
      ]);
    // Act
    const response = await exerciseSearch();
    // Assert
    expect(response).toEqual({
      filters: {
        equipments: {label: 'Equipment', values: ['Barbell']},
        muscleGroups: {
          label: 'Muscle Groups',
          values: ['Chest', 'Shoulders', 'Triceps'],
        },
        specificMuscles: {
          label: 'Specific Muscles',
          values: [
            'Anterior Deltoid',
            'Pectoralis Major (Clavicular Head)',
            'Pectoralis Major (Sternal Head)',
            'Triceps Brachii (Long Head)',
            'Triceps Brachii (Medial Head)',
          ],
        },
      },
      searchResults: [
        {
          itemId: '61697437-3060-49c8-ac07-557433dc6d83',
          itemName: 'Barbell guillotine bench press',
        },
        {
          itemId: '68768f7d-b069-44e4-9575-71fe53076eac',
          itemName: 'Barbell incline bench press medium-grip',
        },
        {
          itemId: 'ed467adc-1ca5-4010-ac65-204ccf4ac1b5',
          itemName: 'Barbell incline bench press - medium grip',
        },
      ],
    });
    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: exerciseSearchQueryNoFilters},
    ]);
  });

  test('exerciseSearch - returns error', async () => {
    // Arrange
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: exerciseSearchQueryNoFilters,
          },
          result: [],
          error: 'Error Message',
        },
      ]);
    // Act
    const response = await exerciseSearch();
    // Assert
    expect(response).toEqual(null);
    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: exerciseSearchQueryNoFilters},
    ]);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      "(function)=(exerciseSearch); - error recieved 'Error Message'",
    );
  });

  test('exerciseSearch - no results', async () => {
    // Arrange
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: exerciseSearchQueryNoFilters,
          },
          result: [],
          error: null,
        },
      ]);
    // Act
    const response = await exerciseSearch();
    // Assert
    expect(response).toEqual({
      filters: {
        equipments: {label: 'Equipment', values: []},
        muscleGroups: {label: 'Muscle Groups', values: []},
        specificMuscles: {label: 'Specific Muscles', values: []},
      },
      searchResults: [],
    });
    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: exerciseSearchQueryNoFilters},
    ]);
  });
});
