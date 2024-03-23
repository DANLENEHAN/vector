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
    "equipment_agg AS (SELECT exercise_equipment.exercise_id, GROUP_CONCAT(equipment.name, ';') as " +
    'equipment_name, COUNT(DISTINCT(equipment.name)) as equipment_count FROM equipment INNER JOIN ' +
    'exercise_equipment ON (exercise_equipment.equipment_id = equipment.equipment_id) WHERE ' +
    '(exercise_equipment.exercise_id IN (SELECT exercise_id FROM exercises)) GROUP BY ' +
    'exercise_equipment.exercise_id), specific_muscle_agg AS (SELECT exercise_specific_muscle.exercise_id,' +
    ' specific_muscle.sub_muscle_group_id, specific_muscle.name as specific_muscle FROM specific_muscle ' +
    'INNER JOIN exercise_specific_muscle ON (exercise_specific_muscle.specific_muscle_id = ' +
    'specific_muscle.specific_muscle_id) WHERE (exercise_specific_muscle.exercise_id IN (SELECT exercise_id ' +
    'FROM exercises))), sub_muscle_group_agg AS (SELECT sub_muscle_group.muscle_group_id, sub_muscle_group.name ' +
    'as sub_muscle_group, specific_muscle_agg.specific_muscle, specific_muscle_agg.exercise_id FROM sub_muscle_group ' +
    'INNER JOIN specific_muscle_agg ON (sub_muscle_group.sub_muscle_group_id = specific_muscle_agg.sub_muscle_group_id)), ' +
    "muscle_group_agg AS (SELECT GROUP_CONCAT(muscle_group.name, ';') as muscle_group, COUNT(DISTINCT(muscle_group.name)) as " +
    "muscle_group_count, GROUP_CONCAT(sub_muscle_group_agg.sub_muscle_group, ';') as sub_muscle_group, " +
    'COUNT(DISTINCT(sub_muscle_group_agg.sub_muscle_group)) as sub_muscle_group_count, ' +
    "GROUP_CONCAT(sub_muscle_group_agg.specific_muscle, ';') as specific_muscle, " +
    'COUNT(DISTINCT(sub_muscle_group_agg.specific_muscle)) as specific_muscle_count, sub_muscle_group_agg.exercise_id ' +
    'FROM muscle_group INNER JOIN sub_muscle_group_agg ON (sub_muscle_group_agg.muscle_group_id = muscle_group.muscle_group_id) ' +
    'GROUP BY exercise_id) SELECT exercises.exercise_id, exercises.exercise_name, equipment_agg.equipment_name, ' +
    'muscle_group_agg.muscle_group, muscle_group_agg.sub_muscle_group, muscle_group_agg.specific_muscle FROM exercises ' +
    'INNER JOIN equipment_agg ON (equipment_agg.exercise_id = exercises.exercise_id) INNER JOIN muscle_group_agg ON ' +
    '(muscle_group_agg.exercise_id = exercises.exercise_id)';

  const exerciseSearchResponse = [
    {
      equipment_name: 'Barbell',
      exercise_id: '61697437-3060-49c8-ac07-557433dc6d83',
      exercise_name: 'Barbell guillotine bench press',
      muscle_group: 'Chest;Chest;Shoulders;Triceps;Triceps',
      sub_muscle_group: 'Upper Chest;Upper Chest',
      specific_muscle:
        'Pectoralis Major (Clavicular Head);Pectoralis Major (Sternal Head);Anterior Deltoid;Triceps Brachii (Long Head);Triceps Brachii (Medial Head)',
    },
    {
      equipment_name: 'Barbell',
      exercise_id: '68768f7d-b069-44e4-9575-71fe53076eac',
      exercise_name: 'Barbell incline bench press medium-grip',
      muscle_group: 'Chest;Chest;Shoulders;Triceps;Triceps',
      sub_muscle_group: 'Upper Chest;Upper Chest',
      specific_muscle:
        'Pectoralis Major (Clavicular Head);Pectoralis Major (Sternal Head);Anterior Deltoid;Triceps Brachii (Long Head);Triceps Brachii (Medial Head)',
    },
    {
      equipment_name: 'Barbell',
      exercise_id: 'ed467adc-1ca5-4010-ac65-204ccf4ac1b5',
      exercise_name: 'Barbell incline bench press - medium grip',
      muscle_group: 'Chest;Chest;Shoulders;Triceps;Triceps',
      sub_muscle_group: 'Upper Chest;Upper Chest',
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
      'WITH exercises as (SELECT exercise.name as exercise_name, exercise.exercise_id FROM ' +
      "exercise WHERE (name LIKE '%bench press%')), equipment_agg AS (SELECT exercise_equipment.exercise_id, " +
      "GROUP_CONCAT(equipment.name, ';') as equipment_name, COUNT(DISTINCT(equipment.name)) as equipment_count " +
      'FROM equipment INNER JOIN exercise_equipment ON (exercise_equipment.equipment_id = equipment.equipment_id) ' +
      "WHERE (exercise_equipment.exercise_id IN (SELECT exercise_id FROM exercises) and equipment.name IN ('Barbell')) " +
      'GROUP BY exercise_equipment.exercise_id), specific_muscle_agg AS (SELECT exercise_specific_muscle.exercise_id, ' +
      'specific_muscle.sub_muscle_group_id, specific_muscle.name as specific_muscle FROM specific_muscle INNER JOIN ' +
      'exercise_specific_muscle ON (exercise_specific_muscle.specific_muscle_id = specific_muscle.specific_muscle_id) ' +
      'WHERE (exercise_specific_muscle.exercise_id IN (SELECT exercise_id FROM exercises))), sub_muscle_group_agg AS ' +
      '(SELECT sub_muscle_group.muscle_group_id, sub_muscle_group.name as sub_muscle_group, specific_muscle_agg.specific_muscle, ' +
      'specific_muscle_agg.exercise_id FROM sub_muscle_group INNER JOIN specific_muscle_agg ON (sub_muscle_group.sub_muscle_group_id ' +
      "= specific_muscle_agg.sub_muscle_group_id)), muscle_group_agg AS (SELECT GROUP_CONCAT(muscle_group.name, ';') as muscle_group, " +
      "COUNT(DISTINCT(muscle_group.name)) as muscle_group_count, GROUP_CONCAT(sub_muscle_group_agg.sub_muscle_group, ';') as " +
      'sub_muscle_group, COUNT(DISTINCT(sub_muscle_group_agg.sub_muscle_group)) as sub_muscle_group_count, GROUP_CONCAT(' +
      "sub_muscle_group_agg.specific_muscle, ';') as specific_muscle, COUNT(DISTINCT(sub_muscle_group_agg.specific_muscle)) " +
      'as specific_muscle_count, sub_muscle_group_agg.exercise_id FROM muscle_group INNER JOIN sub_muscle_group_agg ON ' +
      '(sub_muscle_group_agg.muscle_group_id = muscle_group.muscle_group_id) GROUP BY exercise_id) SELECT exercises.exercise_id, ' +
      'exercises.exercise_name, equipment_agg.equipment_name, muscle_group_agg.muscle_group, muscle_group_agg.sub_muscle_group, ' +
      'muscle_group_agg.specific_muscle FROM exercises INNER JOIN equipment_agg ON (equipment_agg.exercise_id = exercises.exercise_id) ' +
      'INNER JOIN muscle_group_agg ON (muscle_group_agg.exercise_id = exercises.exercise_id) WHERE (equipment_count = 1 and ' +
      "muscle_group_agg.muscle_group LIKE '%Chest%' and muscle_group_agg.muscle_group LIKE '%Shoulders%' and muscle_group_agg.muscle_group " +
      "LIKE '%Triceps%' and muscle_group_agg.specific_muscle LIKE '%Pectoralis Major (Clavicular Head)%')";
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
      'WITH exercises as (SELECT exercise.name as exercise_name, exercise.exercise_id FROM exercise WHERE ' +
      "(name LIKE '%bench press%')), equipment_agg AS (SELECT exercise_equipment.exercise_id, GROUP_CONCAT(equipment.name, ';') " +
      'as equipment_name, COUNT(DISTINCT(equipment.name)) as equipment_count FROM equipment INNER JOIN exercise_equipment ON ' +
      '(exercise_equipment.equipment_id = equipment.equipment_id) WHERE (exercise_equipment.exercise_id IN (SELECT exercise_id ' +
      "FROM exercises) and equipment.name IN ('Barbell')) GROUP BY exercise_equipment.exercise_id), specific_muscle_agg AS " +
      '(SELECT exercise_specific_muscle.exercise_id, specific_muscle.sub_muscle_group_id, specific_muscle.name as specific_muscle ' +
      'FROM specific_muscle INNER JOIN exercise_specific_muscle ON (exercise_specific_muscle.specific_muscle_id = specific_muscle.' +
      'specific_muscle_id) WHERE (exercise_specific_muscle.exercise_id IN (SELECT exercise_id FROM exercises))), sub_muscle_group_agg ' +
      'AS (SELECT sub_muscle_group.muscle_group_id, sub_muscle_group.name as sub_muscle_group, specific_muscle_agg.specific_muscle, ' +
      'specific_muscle_agg.exercise_id FROM sub_muscle_group INNER JOIN specific_muscle_agg ON (sub_muscle_group.sub_muscle_group_id = ' +
      "specific_muscle_agg.sub_muscle_group_id)), muscle_group_agg AS (SELECT GROUP_CONCAT(muscle_group.name, ';') as muscle_group, " +
      "COUNT(DISTINCT(muscle_group.name)) as muscle_group_count, GROUP_CONCAT(sub_muscle_group_agg.sub_muscle_group, ';') as " +
      'sub_muscle_group, COUNT(DISTINCT(sub_muscle_group_agg.sub_muscle_group)) as sub_muscle_group_count, GROUP_CONCAT(sub_muscle' +
      "_group_agg.specific_muscle, ';') as specific_muscle, COUNT(DISTINCT(sub_muscle_group_agg.specific_muscle)) as " +
      'specific_muscle_count, sub_muscle_group_agg.exercise_id FROM muscle_group INNER JOIN sub_muscle_group_agg ON ' +
      "(sub_muscle_group_agg.muscle_group_id = muscle_group.muscle_group_id) WHERE (muscle_group.name IN ('Chest', 'Shoulders', " +
      "'Triceps')) GROUP BY exercise_id) SELECT exercises.exercise_id, exercises.exercise_name, equipment_agg.equipment_name, " +
      'muscle_group_agg.muscle_group, muscle_group_agg.sub_muscle_group, muscle_group_agg.specific_muscle FROM exercises INNER ' +
      'JOIN equipment_agg ON (equipment_agg.exercise_id = exercises.exercise_id) INNER JOIN muscle_group_agg ON (muscle_group_agg.' +
      'exercise_id = exercises.exercise_id) WHERE (equipment_count = 1 and muscle_group_count = 3)';
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
        subMuscleGroups: {
          label: 'Sub Muscle Groups',
          values: ['Upper Chest'],
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
        subMuscleGroups: {label: 'Sub Muscle Groups', values: []},
      },
      searchResults: [],
    });
    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: exerciseSearchQueryNoFilters},
    ]);
  });
});
