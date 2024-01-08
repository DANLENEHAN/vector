/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * BodypartCreateSchema
 * Schema for validating the full exercise_bodypart schema
 */
export interface BodypartCreateSchema {
  /** Muscle groups */
  muscle_group: MuscleGroup;
  /** Sub muscle groups */
  specific_muscle: SubMuscleGroup;
}

/**
 * BodypartGetSchema
 * ExerciseBodyPartGetSchema get schema
 */
export interface BodypartGetSchema {
  /**
   * Bodypart Id
   * @example 1
   */
  bodypart_id: number;
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  created_at: string;
  /** Muscle groups */
  muscle_group: MuscleGroup;
  /** Sub muscle groups */
  specific_muscle: SubMuscleGroup;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  updated_at: string;
}

/**
 * CaloriesUnit
 * Calories units.
 */
export enum CaloriesUnit {
  Kcal = 'kcal',
  Kj = 'kj',
}

/**
 * DateFormat
 * Accepted date formats.
 */
export enum DateFormat {
  ValueYMD = '%Y-%m-%d',
  ValueMDY = '%m-%d-%Y',
  ValueDMY = '%d-%m-%Y',
}

/**
 * DifficultyLevel
 * Difficulty levels.
 */
export enum DifficultyLevel {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/**
 * EquipmentCreateSchema
 * Schema for validating the full equipment schema
 */
export interface EquipmentCreateSchema {
  /**
   * Brand
   * @default null
   * @example "Rogue"
   */
  brand?: string | null;
  /**
   * Description
   * @example "A pair of 10lb dumbbells"
   */
  description: string;
  /**
   * Increment
   * @default null
   * @example 2.5
   */
  increment?: number | null;
  /**
   * Max Weight
   * @default null
   * @example 100
   */
  max_weight?: number | null;
  /**
   * Min Weight
   * @default null
   * @example 10
   */
  min_weight?: number | null;
  /**
   * Model
   * @default null
   * @example "Rogue 10lb dumbbells"
   */
  model?: string | null;
  /**
   * Name
   * @example "Dumbbells"
   */
  name: string;
  /**
   * Type
   * @default null
   * @example "Dumbbell"
   */
  type?: string | null;
}

/**
 * EquipmentGetSchema
 * Schema for validating the equipment get schema
 */
export interface EquipmentGetSchema {
  /**
   * Brand
   * @default null
   * @example "Rogue"
   */
  brand?: string | null;
  /**
   * Created At
   * @example "2021-05-18T20:00:00"
   */
  created_at: string;
  /**
   * Description
   * @example "A pair of 10lb dumbbells"
   */
  description: string;
  /**
   * Equipment Id
   * @min 0
   * @example 1
   */
  equipment_id: number;
  /**
   * Increment
   * @default null
   * @example 2.5
   */
  increment?: number | null;
  /**
   * Max Weight
   * @default null
   * @example 100
   */
  max_weight?: number | null;
  /**
   * Min Weight
   * @default null
   * @example 10
   */
  min_weight?: number | null;
  /**
   * Model
   * @default null
   * @example "Rogue 10lb dumbbells"
   */
  model?: string | null;
  /**
   * Name
   * @example "Dumbbells"
   */
  name: string;
  /**
   * Type
   * @default null
   * @example "Dumbbell"
   */
  type?: string | null;
  /**
   * Updated At
   * @example "2021-05-18T20:00:00"
   */
  updated_at: string;
}

/**
 * EquipmentUpdateSchema
 * Schema for validating the equipment update schema
 */
export interface EquipmentUpdateSchema {
  /**
   * Brand
   * @default null
   * @example "Rogue"
   */
  brand?: string | null;
  /**
   * Description
   * @example "A pair of 10lb dumbbells"
   */
  description: string;
  /**
   * Equipment Id
   * @min 0
   * @example 1
   */
  equipment_id: number;
  /**
   * Increment
   * @default null
   * @example 2.5
   */
  increment?: number | null;
  /**
   * Max Weight
   * @default null
   * @example 100
   */
  max_weight?: number | null;
  /**
   * Min Weight
   * @default null
   * @example 10
   */
  min_weight?: number | null;
  /**
   * Model
   * @default null
   * @example "Rogue 10lb dumbbells"
   */
  model?: string | null;
  /**
   * Name
   * @example "Dumbbells"
   */
  name: string;
  /**
   * Type
   * @default null
   * @example "Dumbbell"
   */
  type?: string | null;
}

/**
 * ExerciseBodypartCreateSchema
 * Schema for validating the full exercise_bodypart schema
 */
export interface ExerciseBodypartCreateSchema {
  /**
   * Bodypart Id
   * @example 1
   */
  bodypart_id: number;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
  /**
   * Severity levels. For a set for example you
   * could do number of sets divided by the severity level
   */
  severity: SeverityLevel;
}

/**
 * ExerciseBodypartGetSchema
 * ExerciseBodypart get schema
 */
export interface ExerciseBodypartGetSchema {
  /**
   * Bodypart Id
   * @example 1
   */
  bodypart_id: number;
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  created_at: string;
  /**
   * Exercise Bodypart Id
   * @example 1
   */
  exercise_bodypart_id: number;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
  /**
   * Severity levels. For a set for example you
   * could do number of sets divided by the severity level
   */
  severity: SeverityLevel;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  updated_at: string;
}

/**
 * ExerciseBodypartUpdateSchema
 * ExerciseBodypart update schema
 */
export interface ExerciseBodypartUpdateSchema {
  /**
   * Bodypart Id
   * @example 1
   */
  bodypart_id: number;
  /**
   * Exercise Bodypart Id
   * @example 1
   */
  exercise_bodypart_id: number;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
  /**
   * Severity levels. For a set for example you
   * could do number of sets divided by the severity level
   */
  severity: SeverityLevel;
}

/**
 * ExerciseCreateSchema
 * Schema for validating the full exercise schema
 */
export interface ExerciseCreateSchema {
  /**
   * Category
   * @example "Compound"
   */
  category: string;
  /**
   * Description
   * @example "This exercise is a compound exercise"
   */
  description: string;
  /** Difficulty levels. */
  difficulty_level: DifficultyLevel;
  /**
   * Instructions
   * @example "Put the bar on your back and squat"
   */
  instructions: string;
  /** Laterality. */
  laterality: Laterality;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
}

/**
 * ExerciseEquipmentCreateSchema
 * Schema for validating the full exercise_equipment schema
 */
export interface ExerciseEquipmentCreateSchema {
  /**
   * Equipment Id
   * @example 1
   */
  equipment_id: number;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
}

/**
 * ExerciseEquipmentGetSchema
 * ExerciseEquipmentGetSchema get schema
 */
export interface ExerciseEquipmentGetSchema {
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  created_at: string;
  /**
   * Equipment Id
   * @example 1
   */
  equipment_id: number;
  /**
   * Exercise Equipment Id
   * @example 1
   */
  exercise_equipment_id: number;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  updated_at: string;
}

/**
 * ExerciseEquipmentUpdateSchema
 * ExerciseEquipmentGetSchema update schema
 */
export interface ExerciseEquipmentUpdateSchema {
  /**
   * Equipment Id
   * @example 1
   */
  equipment_id: number;
  /**
   * Exercise Equipment Id
   * @example 1
   */
  exercise_equipment_id: number;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
}

/**
 * ExerciseGetSchema
 * Exercise get schema
 */
export interface ExerciseGetSchema {
  /**
   * Category
   * @example "Compound"
   */
  category: string;
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  created_at: string;
  /**
   * Created By
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * @example "This exercise is a compound exercise"
   */
  description: string;
  /** Difficulty levels. */
  difficulty_level: DifficultyLevel;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
  /**
   * Instructions
   * @example "Put the bar on your back and squat"
   */
  instructions: string;
  /** Laterality. */
  laterality: Laterality;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T20:00:00"
   */
  updated_at: string;
}

/**
 * ExerciseUpdateSchema
 * Schema for validating the full exercise schema
 */
export interface ExerciseUpdateSchema {
  /**
   * Category
   * @example "Compound"
   */
  category: string;
  /**
   * Description
   * @example "This exercise is a compound exercise"
   */
  description: string;
  /** Difficulty levels. */
  difficulty_level: DifficultyLevel;
  /**
   * Exercise Id
   * @example 1
   */
  exercise_id: number;
  /**
   * Instructions
   * @example "Put the bar on your back and squat"
   */
  instructions: string;
  /** Laterality. */
  laterality: Laterality;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
}

/**
 * FeelingUnit
 * Feeling units.
 */
export type FeelingUnit = 'out_of_10';

/**
 * FitnessGoal
 * Fitness goals.
 */
export enum FitnessGoal {
  LoseWeight = 'lose_weight',
  BuildMuscle = 'build_muscle',
  MaintainWeight = 'maintain_weight',
  IncreaseStrength = 'increase_strength',
  ImproveCardio = 'improve_cardio',
  ImproveTechnique = 'improve_technique',
}

/**
 * Gender
 * Enum for user gender
 */
export enum Gender {
  Male = 'male',
  Female = 'female',
}

/**
 * HeightUnit
 * Height units.
 */
export enum HeightUnit {
  Cm = 'cm',
  Inch = 'inch',
  Feet = 'feet',
}

/**
 * Laterality
 * Laterality.
 */
export enum Laterality {
  Bilateral = 'bilateral',
  Unilateral = 'unilateral',
}

/**
 * MuscleGroup
 * Muscle groups
 */
export enum MuscleGroup {
  Chest = 'Chest',
  Back = 'Back',
  Shoulders = 'Shoulders',
  Biceps = 'Biceps',
  Triceps = 'Triceps',
  Legs = 'Legs',
  Glutes = 'Glutes',
  Abdominals = 'Abdominals',
  Calves = 'Calves',
  Forearms = 'Forearms',
  Neck = 'Neck',
  Traps = 'Traps',
}

/**
 * PlanComponentCreateSchema
 * Validation schema for the Plan Component model.
 */
export interface PlanComponentCreateSchema {
  /**
   * Description
   * The description of the plan component
   * @default null
   * @example "My plan component description"
   */
  description?: string | null;
  /**
   * Name
   * The name of the plan component
   * @maxLength 100
   * @example "Plan Day 1"
   */
  name: string;
  /**
   * Plan Id
   * The ID of the plan
   * @min 0
   * @example 1
   */
  plan_id: number;
}

/**
 * PlanComponentGetSchema
 * Validation schema for the Plan Component model.
 */
export interface PlanComponentGetSchema {
  /**
   * Description
   * The description of the plan component
   * @default null
   * @example "My plan component description"
   */
  description?: string | null;
  /**
   * Name
   * The name of the plan component
   * @maxLength 100
   * @example "Plan Day 1"
   */
  name: string;
  /**
   * Plan Component Id
   * The id of the plan component
   * @min 0
   * @example 1
   */
  plan_component_id: number;
  /**
   * Plan Id
   * The ID of the plan
   * @min 0
   * @example 1
   */
  plan_id: number;
}

/**
 * PlanComponentUpdateSchema
 * Validation schema for the Plan Component model.
 */
export interface PlanComponentUpdateSchema {
  /**
   * Description
   * The description of the plan component
   * @default null
   * @example "My plan component description"
   */
  description?: string | null;
  /**
   * Name
   * The name of the plan component
   * @maxLength 100
   * @example "Plan Day 1"
   */
  name: string;
  /**
   * Plan Component Id
   * The id of the plan componen
   * @min 0
   * @example 1
   */
  plan_component_id: number;
  /**
   * Plan Id
   * The ID of the plan
   * @min 0
   * @example 1
   */
  plan_id: number;
}

/**
 * PlanCreateSchema
 * Validation schema for the Plan model.
 */
export interface PlanCreateSchema {
  /**
   * Created By
   * The user_id of the user who created the plan
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * The description of the plan
   * @default null
   * @example "My plan description"
   */
  description?: string | null;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Active
   * The plan is activly being used by the user
   * @default true
   * @example true
   */
  is_active?: boolean;
  /**
   * Name
   * The name of the plan
   * @maxLength 100
   * @example "My plan"
   */
  name: string;
}

/**
 * PlanGetSchema
 * Validation schema for the Plan model.
 */
export interface PlanGetSchema {
  /**
   * Created By
   * The user_id of the user who created the plan
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * The description of the plan
   * @default null
   * @example "My plan description"
   */
  description?: string | null;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Active
   * The plan is activly being used by the user
   * @default true
   * @example true
   */
  is_active?: boolean;
  /**
   * Name
   * The name of the plan
   * @maxLength 100
   * @example "My plan"
   */
  name: string;
  /**
   * Plan Id
   * The id of the plan
   * @min 0
   * @example 1
   */
  plan_id: number;
}

/**
 * PlanUpdateSchema
 * Validation schema for the Plan model.
 */
export interface PlanUpdateSchema {
  /**
   * Created By
   * The user_id of the user who created the plan
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * The description of the plan
   * @default null
   * @example "My plan description"
   */
  description?: string | null;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Active
   * The plan is activly being used by the user
   * @default true
   * @example true
   */
  is_active?: boolean;
  /**
   * Name
   * The name of the plan
   * @maxLength 100
   * @example "My plan"
   */
  name: string;
  /**
   * Plan Id
   * The id of the plan
   * @min 0
   * @example 1
   */
  plan_id: number;
}

/**
 * ProfileStatus
 * Enum for user status
 */
export enum ProfileStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
  Banned = 'banned',
}

/**
 * QuerySchema
 * Validation schema for the Query model.
 */
export interface QuerySchema {
  /**
   * Filters
   * The filters to apply to the query
   * @default {}
   * @example {"stat_id":{"eq":1}}
   */
  filters?: object;
  /**
   * Sort
   * The sort to apply to the query
   * @default ["created_at:desc"]
   * @example ["created_at:desc"]
   */
  sort?: any[];
}

/**
 * SetComponentCreateSchema
 * Schema to validate the set component create schema
 */
export interface SetComponentCreateSchema {
  /**
   * Description
   * @default null
   * @example "Leave nothing in the tank here"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Exercise Id
   * @min 0
   * @example 1
   */
  exercise_id: number;
  /**
   * Feeling
   * @default null
   * @example 10
   */
  feeling?: number | null;
  /**
   * Name
   * @example "Bench dropset"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "I could have done one more"
   */
  note?: string | null;
  /**
   * Reps
   * @min 0
   * @example 10
   */
  reps: number;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Rir
   * @default null
   * @example 0
   */
  rir?: number | null;
  /**
   * Rpe
   * @default null
   * @example 10
   */
  rpe?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Set Id
   * @min 0
   * @example 1
   */
  set_id: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Tempo
   * @default null
   * @example "2-0-1-1"
   */
  tempo?: string | null;
  /**
   * Weight
   * @min 0
   * @example 100
   */
  weight: number;
  /** Weight units. */
  weight_metric: WeightUnit;
}

/**
 * SetComponentGetSchema
 * Schema to validate the set component get response schema
 */
export interface SetComponentGetSchema {
  /**
   * Description
   * @default null
   * @example "Leave nothing in the tank here"
   */
  description?: string | null;
  /**
   * Duration
   * @min 0
   * @example 60
   */
  duration: number;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Exercise Id
   * @min 0
   * @example 1
   */
  exercise_id: number;
  /**
   * Feeling
   * @default null
   * @example 10
   */
  feeling?: number | null;
  /**
   * Name
   * @example "Bench dropset"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "I could have done one more"
   */
  note?: string | null;
  /**
   * Reps
   * @min 0
   * @example 10
   */
  reps: number;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Rir
   * @default null
   * @example 0
   */
  rir?: number | null;
  /**
   * Rpe
   * @default null
   * @example 10
   */
  rpe?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Set Component Id
   * @min 0
   * @example 1
   */
  set_component_id: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Tempo
   * @default null
   * @example "2-0-1-1"
   */
  tempo?: string | null;
  /**
   * Weight
   * @min 0
   * @example 100
   */
  weight: number;
  /** Weight units. */
  weight_metric: WeightUnit;
}

/**
 * SetComponentTreeCreateSchema
 * A tree version of the SetComponentCreateSchema where
 * 'set_id' is not required upfront because the all the
 * objects in the tree will be created together.
 */
export interface SetComponentTreeCreateSchema {
  /**
   * Description
   * @default null
   * @example "Leave nothing in the tank here"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Exercise Id
   * @min 0
   * @example 1
   */
  exercise_id: number;
  /**
   * Feeling
   * @default null
   * @example 10
   */
  feeling?: number | null;
  /**
   * Name
   * @example "Bench dropset"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "I could have done one more"
   */
  note?: string | null;
  /**
   * Reps
   * @min 0
   * @example 10
   */
  reps: number;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Rir
   * @default null
   * @example 0
   */
  rir?: number | null;
  /**
   * Rpe
   * @default null
   * @example 10
   */
  rpe?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Tempo
   * @default null
   * @example "2-0-1-1"
   */
  tempo?: string | null;
  /**
   * Weight
   * @min 0
   * @example 100
   */
  weight: number;
  /** Weight units. */
  weight_metric: WeightUnit;
}

/**
 * SetComponentUpdateSchema
 * Schema to validate the set component update schema
 */
export interface SetComponentUpdateSchema {
  /**
   * Description
   * @default null
   * @example "Leave nothing in the tank here"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Exercise Id
   * @min 0
   * @example 1
   */
  exercise_id: number;
  /**
   * Feeling
   * @default null
   * @example 10
   */
  feeling?: number | null;
  /**
   * Name
   * @example "Bench dropset"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "I could have done one more"
   */
  note?: string | null;
  /**
   * Reps
   * @min 0
   * @example 10
   */
  reps: number;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Rir
   * @default null
   * @example 0
   */
  rir?: number | null;
  /**
   * Rpe
   * @default null
   * @example 10
   */
  rpe?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Set Component Id
   * @min 0
   * @example 1
   */
  set_component_id: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Tempo
   * @default null
   * @example "2-0-1-1"
   */
  tempo?: string | null;
  /**
   * Weight
   * @min 0
   * @example 100
   */
  weight: number;
  /** Weight units. */
  weight_metric: WeightUnit;
}

/**
 * SetCreateSchema
 * Schema for validating the full set schema
 */
export interface SetCreateSchema {
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's straight set"
   */
  name: string;
  /**
   * Note
   * @example "Circut was too easy, add more weight"
   */
  note: string;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Component Id
   * @min 0
   * @example 1
   */
  workout_component_id: number;
}

/**
 * SetGetSchema
 * Schema to validate the set get schema
 */
export interface SetGetSchema {
  /**
   * Duration
   * @min 0
   * @example 60
   */
  duration: number;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's straight set"
   */
  name: string;
  /**
   * Note
   * @example "Circut was too easy, add more weight"
   */
  note: string;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Set Id
   * @min 0
   * @example 1
   */
  set_id: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Component Id
   * @min 0
   * @example 1
   */
  workout_component_id: number;
}

/**
 * SetTreeCreateSchema
 * A tree version of the SetCreateSchema where
 * all child components are included nested within the set.
 * The set itself is also nested within it's parent workout
 * component so the 'workout_component_id' is excluded.
 */
export interface SetTreeCreateSchema {
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's straight set"
   */
  name: string;
  /**
   * Note
   * @example "Circut was too easy, add more weight"
   */
  note: string;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /** Set Components */
  set_components: SetComponentTreeCreateSchema[];
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
}

/**
 * SetTreeRootCreateSchema
 * A tree version of the SetCreateSchema where
 * all child components are included nested within set.
 * The set in this case is not nested within the workout componet.
 * It is the root of the workout tree. So the 'workout_component_id' is
 * required.
 */
export interface SetTreeRootCreateSchema {
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's straight set"
   */
  name: string;
  /**
   * Note
   * @example "Circut was too easy, add more weight"
   */
  note: string;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /** Set Components */
  set_components: SetComponentTreeCreateSchema[];
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Component Id
   * @min 0
   * @example 1
   */
  workout_component_id: number;
}

/**
 * SetUpdateSchema
 * Schema to validate the set update schema
 */
export interface SetUpdateSchema {
  /**
   * Name
   * @example "Dan's straight set"
   */
  name: string;
  /**
   * Note
   * @example "Circut was too easy, add more weight"
   */
  note: string;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Set Id
   * @min 0
   * @example 1
   */
  set_id: number;
  /**
   * Workout Component Id
   * @min 0
   * @example 1
   */
  workout_component_id: number;
}

/**
 * SeverityLevel
 * Severity levels. For a set for example you
 * could do number of sets divided by the severity level
 */
export enum SeverityLevel {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/**
 * StatSchema
 * Validation schema for the Stat model.
 */
export interface StatSchema {
  /**
   * Note
   * The note of the stat
   * @default null
   * @example "I feel great!"
   */
  note?: string | null;
  /**
   * The type of the stat
   * @example "weight"
   */
  stat_type: StatType;
  /**
   * Unit
   * The unit of the stat
   * @maxLength 50
   * @example "kg"
   */
  unit:
    | CaloriesUnit
    | FeelingUnit
    | HeightUnit
    | StepsUnit
    | WaterUnit
    | WeightUnit;
  /**
   * User Id
   * The user_id of the stat
   * @example 1
   */
  user_id: number;
  /**
   * Value
   * The value of the stat
   * @min 0
   * @example 1
   */
  value: number;
}

/**
 * StatType
 * Stat types.
 */
export enum StatType {
  Height = 'height',
  Weight = 'weight',
  Feeling = 'feeling',
  Water = 'water',
  Calories = 'calories',
  Steps = 'steps',
}

/**
 * StepsUnit
 * Steps units.
 */
export type StepsUnit = 'steps';

/**
 * SubMuscleGroup
 * Sub muscle groups
 */
export enum SubMuscleGroup {
  PectoralisMajorClavicularHead = 'Pectoralis Major (Clavicular Head)',
  PectoralisMajorSternalHead = 'Pectoralis Major (Sternal Head)',
  PectoralisMajorAbdominalHead = 'Pectoralis Major (Abdominal Head)',
  PectoralisMinor = 'Pectoralis Minor',
  AnteriorDeltoid = 'Anterior Deltoid',
  LateralDeltoid = 'Lateral Deltoid',
  PosteriorDeltoid = 'Posterior Deltoid',
  VastusLateralis = 'Vastus Lateralis',
  RectusFemoris = 'Rectus Femoris',
  VastusIntermedius = 'Vastus Intermedius',
  VastusMedialis = 'Vastus Medialis',
  TensorFasciaeLatae = 'Tensor Fasciae Latae',
  Semimembranosus = 'Semimembranosus',
  Semitendinosus = 'Semitendinosus',
  BicepsFemorisLongHead = 'Biceps Femoris (Long Head)',
  BicepsFemorisShortHead = 'Biceps Femoris (Short Head)',
  AdductorBrevis = 'Adductor Brevis',
  AdductorLongus = 'Adductor Longus',
  AdductorMagnus = 'Adductor Magnus',
  Gracilis = 'Gracilis',
  Pectineus = 'Pectineus',
  Iliopsoas = 'Iliopsoas',
  GluteusMaximus = 'Gluteus Maximus',
  GluteusMedius = 'Gluteus Medius',
  GluteusMinimus = 'Gluteus Minimus',
  RectusAbdominis = 'Rectus Abdominis',
  TransverseAbdominis = 'Transverse Abdominis',
  InternalObliques = 'Internal Obliques',
  ExternalObliques = 'External Obliques',
  Pyramidalis = 'Pyramidalis',
  SerratusAnterior = 'Serratus Anterior',
  Gastrocnemius = 'Gastrocnemius',
  Soleus = 'Soleus',
  Plantaris = 'Plantaris',
  Brachioradialis = 'Brachioradialis',
  FlexorCarpiRadialis = 'Flexor Carpi Radialis',
  FlexorCarpiUlnaris = 'Flexor Carpi Ulnaris',
  PalmarisLongus = 'Palmaris Longus',
  ExtensorCarpiRadialisBrevis = 'Extensor Carpi Radialis Brevis',
  ExtensorCarpiRadialisLongus = 'Extensor Carpi Radialis Longus',
  ExtensorCarpiUlnaris = 'Extensor Carpi Ulnaris',
  FlexorDigitorumSuperficialis = 'Flexor Digitorum Superficialis',
  FlexorDigitorumProfundus = 'Flexor Digitorum Profundus',
  ExtensorDigitorum = 'Extensor Digitorum',
  ExtensorIndicis = 'Extensor Indicis',
  ExtensorDigitiMinimi = 'Extensor Digiti Minimi',
  PronatorTeres = 'Pronator Teres',
  PronatorQuadratus = 'Pronator Quadratus',
  Supinator = 'Supinator',
  TrapeziusNeck = 'Trapezius (Neck)',
  Scalenes = 'Scalenes',
  Sternocleidomastoid = 'Sternocleidomastoid',
  BicepsBrachiiLongHead = 'Biceps Brachii (Long Head)',
  BicepsBrachiiShortHead = 'Biceps Brachii (Short Head)',
  Brachialis = 'Brachialis',
  Coracobrachialis = 'Coracobrachialis',
  TricepsBrachiiLongHead = 'Triceps Brachii (Long Head)',
  TricepsBrachiiLateralHead = 'Triceps Brachii (Lateral Head)',
  TricepsBrachiiMedialHead = 'Triceps Brachii (Medial Head)',
  LatissimusDorsi = 'Latissimus Dorsi',
  TrapeziusUpper = 'Trapezius (Upper)',
  TrapeziusMiddle = 'Trapezius (Middle)',
  TrapeziusLower = 'Trapezius (Lower)',
  RhomboidMajor = 'Rhomboid Major',
  RhomboidMinor = 'Rhomboid Minor',
  ErectorSpinae = 'Erector Spinae',
  TeresMajor = 'Teres Major',
  TeresMinor = 'Teres Minor',
  Infraspinatus = 'Infraspinatus',
  Supraspinatus = 'Supraspinatus',
  LevatorScapulae = 'Levator Scapulae',
}

/**
 * UserCreateSchema
 * Schema for validating the full user schema
 */
export interface UserCreateSchema {
  /**
   * Age
   * @min 0
   * @max 125
   */
  age: number;
  /**
   * Birthday
   * @format date
   * @example "1997-05-18"
   */
  birthday: string;
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T12:00:00.000Z"
   */
  created_at: string;
  /** Accepted date formats. */
  date_format_pref: DateFormat;
  /**
   * Email
   * @format email
   * @example "dan@gmail.com"
   */
  email: string;
  /**
   * First Name
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]+$
   * @example "Dan"
   */
  first_name: string;
  /** Enum for user gender */
  gender: Gender;
  /** Fitness goals. */
  goal: FitnessGoal;
  /** Height units. */
  height_unit_pref: HeightUnit;
  /**
   * Language
   * Language setting for the user's account
   * @minLength 2
   * @maxLength 10
   * @pattern ^[A-Za-z]+$
   * @example "en"
   */
  language: string;
  /**
   * Last Name
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]+$
   * @example "Lenehan"
   */
  last_name: string;
  /**
   * Password
   * @minLength 8
   * @maxLength 100
   * @pattern ^[A-Za-z0-9@#$%^&+=]+$
   * @example "RLp6^$L2Ro"
   */
  password: string;
  /**
   * Phone Number
   * @format phone
   * @minLength 7
   * @maxLength 64
   * @example "+447308831531"
   */
  phone_number: string;
  /**
   * Premium
   * @default false
   */
  premium?: boolean;
  /** @default "active" */
  status?: ProfileStatus;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T12:00:00.000Z"
   */
  updated_at: string;
  /**
   * Username
   * @minLength 8
   * @maxLength 100
   * @pattern ^[A-Za-z0-9]+$
   * @example "danlen97"
   */
  username: string;
  /** Weight units. */
  weight_unit_pref: WeightUnit;
}

/**
 * UserGetSchema
 * User get schema
 */
export interface UserGetSchema {
  /**
   * Age
   * @min 0
   * @max 125
   */
  age: number;
  /**
   * Birthday
   * @format date
   * @example "1997-05-18"
   */
  birthday: string;
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T12:00:00.000Z"
   */
  created_at: string;
  /** Accepted date formats. */
  date_format_pref: DateFormat;
  /**
   * Email
   * @format email
   * @example "dan@gmail.com"
   */
  email: string;
  /**
   * First Name
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]+$
   * @example "Dan"
   */
  first_name: string;
  /** Enum for user gender */
  gender: Gender;
  /** Fitness goals. */
  goal: FitnessGoal;
  /** Height units. */
  height_unit_pref: HeightUnit;
  /**
   * Language
   * Language setting for the user's account
   * @minLength 2
   * @maxLength 10
   * @pattern ^[A-Za-z]+$
   * @example "en"
   */
  language: string;
  /**
   * Last Name
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]+$
   * @example "Lenehan"
   */
  last_name: string;
  /**
   * Phone Number
   * @format phone
   * @minLength 7
   * @maxLength 64
   * @example "+447308831531"
   */
  phone_number: string;
  /**
   * Premium
   * @default false
   */
  premium?: boolean;
  /** @default "active" */
  status?: ProfileStatus;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T12:00:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * User ID
   * @example 1
   */
  user_id: number;
  /**
   * Username
   * @minLength 8
   * @maxLength 100
   * @pattern ^[A-Za-z0-9]+$
   * @example "danlen97"
   */
  username: string;
  /** Weight units. */
  weight_unit_pref: WeightUnit;
}

/**
 * UserUpdateSchema
 * Schema for validating user details excluding password
 */
export interface UserUpdateSchema {
  /**
   * Age
   * @min 0
   * @max 125
   */
  age: number;
  /**
   * Birthday
   * @format date
   * @example "1997-05-18"
   */
  birthday: string;
  /**
   * Created At
   * @format date-time
   * @example "2021-05-18T12:00:00.000Z"
   */
  created_at: string;
  /** Accepted date formats. */
  date_format_pref: DateFormat;
  /**
   * Email
   * @format email
   * @example "dan@gmail.com"
   */
  email: string;
  /**
   * First Name
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]+$
   * @example "Dan"
   */
  first_name: string;
  /** Enum for user gender */
  gender: Gender;
  /** Fitness goals. */
  goal: FitnessGoal;
  /** Height units. */
  height_unit_pref: HeightUnit;
  /**
   * Language
   * Language setting for the user's account
   * @minLength 2
   * @maxLength 10
   * @pattern ^[A-Za-z]+$
   * @example "en"
   */
  language: string;
  /**
   * Last Name
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9]+$
   * @example "Lenehan"
   */
  last_name: string;
  /**
   * Phone Number
   * @format phone
   * @minLength 7
   * @maxLength 64
   * @example "+447308831531"
   */
  phone_number: string;
  /**
   * Premium
   * @default false
   */
  premium?: boolean;
  /** @default "active" */
  status?: ProfileStatus;
  /**
   * Updated At
   * @format date-time
   * @example "2021-05-18T12:00:00.000Z"
   */
  updated_at: string;
  /**
   * Username
   * @minLength 8
   * @maxLength 100
   * @pattern ^[A-Za-z0-9]+$
   * @example "danlen97"
   */
  username: string;
  /** Weight units. */
  weight_unit_pref: WeightUnit;
}

/**
 * WaterUnit
 * Water units.
 */
export enum WaterUnit {
  Ml = 'ml',
  FlOz = 'fl oz',
  Cups = 'cups',
}

/**
 * WeightUnit
 * Weight units.
 */
export enum WeightUnit {
  Lbs = 'lbs',
  Kg = 'kg',
  Stone = 'stone',
}

/**
 * WorkoutComponentCreateSchema
 * Schema to validate the workout component create schema
 */
export interface WorkoutComponentCreateSchema {
  /**
   * Description
   * @default null
   * @example "An exercise circuit for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Circut was too easy, add more weight"
   */
  note?: string | null;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Id
   * @min 0
   * @example 1
   */
  workout_id: number;
}

/**
 * WorkoutComponentGetSchema
 * Schema to validate the workout get response schema
 */
export interface WorkoutComponentGetSchema {
  /**
   * Description
   * @default null
   * @example "An exercise circuit for my legs"
   */
  description?: string | null;
  /**
   * Duration
   * @min 0
   * @example 60
   */
  duration: number;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Circut was too easy, add more weight"
   */
  note?: string | null;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Component Id
   * @min 0
   * @example 1
   */
  workout_component_id: number;
  /**
   * Workout Id
   * @min 0
   * @example 1
   */
  workout_id: number;
}

/**
 * WorkoutComponentTreeCreateSchema
 * A tree version of the WorkoutComponentCreateSchema where
 * all child components are included nested within the workout component.
 * The workout component itself is also nested within it's parent workout
 * so the 'workout_id' is excluded.
 */
export interface WorkoutComponentTreeCreateSchema {
  /**
   * Description
   * @default null
   * @example "An exercise circuit for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Circut was too easy, add more weight"
   */
  note?: string | null;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /** Sets */
  sets: SetTreeCreateSchema[];
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
}

/**
 * WorkoutComponentTreeRootCreateSchema
 * A tree version of the WorkoutComponentCreateSchema where
 * all child components are included nested within the workout component.
 * The workout component in this case is not nested within the workout.
 * It is the root of the workout tree. So the 'workout_id' is
 * required.
 */
export interface WorkoutComponentTreeRootCreateSchema {
  /**
   * Description
   * @default null
   * @example "An exercise circuit for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Circut was too easy, add more weight"
   */
  note?: string | null;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /** Sets */
  sets: SetTreeCreateSchema[];
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Id
   * @min 0
   * @example 1
   */
  workout_id: number;
}

/**
 * WorkoutComponentUpdateSchema
 * Schema to validate the workout update schema
 */
export interface WorkoutComponentUpdateSchema {
  /**
   * Description
   * @default null
   * @example "An exercise circuit for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Circut was too easy, add more weight"
   */
  note?: string | null;
  /**
   * Rest Time
   * @default null
   * @example 60
   */
  rest_time?: number | null;
  /**
   * Sequence
   * @min 0
   * @example 1
   */
  sequence: number;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Component Id
   * @min 0
   * @example 1
   */
  workout_component_id: number;
}

/**
 * WorkoutCreateSchema
 * Schema for validating the full workout schema
 */
export interface WorkoutCreateSchema {
  /**
   * Created By
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * @default null
   * @example "A workout for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Template
   * @default false
   * @example false
   */
  is_template?: boolean;
  /**
   * Location
   * @example "Home"
   */
  location: string;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Remember to stretch after"
   */
  note?: string | null;
  /**
   * Plan Component Id
   * @default null
   * @example 1
   */
  plan_component_id?: number | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
}

/**
 * WorkoutGetSchema
 * Schema to validate the workout get response schema
 */
export interface WorkoutGetSchema {
  /**
   * Created By
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * @default null
   * @example "A workout for my legs"
   */
  description?: string | null;
  /**
   * Duration
   * @min 0
   * @example 60
   */
  duration: number;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Template
   * @default false
   * @example false
   */
  is_template?: boolean;
  /**
   * Location
   * @example "Home"
   */
  location: string;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Remember to stretch after"
   */
  note?: string | null;
  /**
   * Plan Component Id
   * @default null
   * @example 1
   */
  plan_component_id?: number | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Workout Id
   * @min 0
   * @example 1
   */
  workout_id: number;
}

/**
 * WorkoutTreeCreateSchema
 * A tree version of the WorkoutCreateSchema where
 * all child components are included nested within the workout.
 * The workout itself is also nested within it's parent plan component
 * so the 'plan_component_id' is excluded.
 */
export interface WorkoutTreeCreateSchema {
  /**
   * Created By
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * @default null
   * @example "A workout for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Template
   * @default false
   * @example false
   */
  is_template?: boolean;
  /**
   * Location
   * @example "Home"
   */
  location: string;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Remember to stretch after"
   */
  note?: string | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /** Workout Components */
  workout_components: WorkoutComponentTreeCreateSchema[];
}

/**
 * WorkoutTreeRootCreateSchema
 * A tree version of the WorkoutCreateSchema where
 * all child components are included nested within the workout.
 * The workout in this case is not nested within the plan component.
 * It is the root of the workout tree. So the 'plan_component_id' is
 * required.
 */
export interface WorkoutTreeRootCreateSchema {
  /**
   * Created By
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * @default null
   * @example "A workout for my legs"
   */
  description?: string | null;
  /**
   * End Time
   * @format date-time
   * @example "2021-05-18T02:00:00"
   */
  end_time: string;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Is Template
   * @default false
   * @example false
   */
  is_template?: boolean;
  /**
   * Location
   * @example "Home"
   */
  location: string;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Remember to stretch after"
   */
  note?: string | null;
  /**
   * Plan Component Id
   * @default null
   * @example 1
   */
  plan_component_id?: number | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /** Workout Components */
  workout_components: WorkoutComponentTreeCreateSchema[];
}

/**
 * WorkoutUpdateSchema
 * Schema to validate the workout update schema
 */
export interface WorkoutUpdateSchema {
  /**
   * Created By
   * @min 0
   * @example 1
   */
  created_by: number;
  /**
   * Description
   * @default null
   * @example "A workout for my legs"
   */
  description?: string | null;
  /** @default null */
  goal?: FitnessGoal | null;
  /**
   * Location
   * @example "Home"
   */
  location: string;
  /**
   * Name
   * @example "Dan's Workout"
   */
  name: string;
  /**
   * Note
   * @default null
   * @example "Remember to stretch after"
   */
  note?: string | null;
  /**
   * Plan Component Id
   * @default null
   * @example 1
   */
  plan_component_id?: number | null;
  /**
   * Workout Id
   * @min 0
   * @example 1
   */
  workout_id: number;
}
