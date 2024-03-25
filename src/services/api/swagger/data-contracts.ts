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
 * BaseOperators
 * Base operators for filters.
 */
export enum BaseOperators {
  Eq = 'eq',
  Ne = 'ne',
  In = 'in',
  NotIn = 'not_in',
  Isnull = 'isnull',
  Notnull = 'notnull',
}

/**
 * BodyStatCreateSchema
 * Validation schema for the BodyStat model.
 */
export interface BodyStatCreateSchema {
  /**
   * Body Stat Id
   * ID for the body body_stat entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  body_stat_id: string;
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Note
   * The note of the body body_stat
   * @default null
   * @example "Big weight in today!"
   */
  note?: string | null;
  /**
   * The type of the body_stat
   * @example "weight"
   */
  stat_type: BodyStatType;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Unit
   * The unit of the body body_stat
   * @example "kg"
   */
  unit: MuscleMeasurementUnit | HeightUnit | WeightUnit;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Id
   * The ID for the user tracking the body body_stat
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
  /**
   * Value
   * The value of the body body_stat
   * @min 0
   * @example 1
   */
  value: number;
}

/**
 * BodyStatType
 * Extended Enum for body statistics including general
 * measurements like height and weight, in addition
 * to specific body parts defined in MeasureableBodyParts.
 */
export enum BodyStatType {
  Height = 'height',
  Weight = 'weight',
  Chest = 'chest',
  Neck = 'neck',
  Shoulders = 'shoulders',
  UpperLeftLeg = 'upper_left_leg',
  LowerLeftLeg = 'lower_left_leg',
  UpperRightLeg = 'upper_right_leg',
  LowerRightLeg = 'lower_right_leg',
  Waist = 'waist',
  Hips = 'hips',
  Glutes = 'glutes',
  UpperRightArm = 'upper_right_arm',
  LowerRightArm = 'lower_right_arm',
  UpperLeftArm = 'upper_left_arm',
  LowerLeftArm = 'lower_left_arm',
}

/**
 * BodyStatUpdateSchema
 * A class representing the schema for updating statistics,
 * inheriting from BodyStatCreateSchema and SyncUpdateSchema.
 */
export interface BodyStatUpdateSchema {
  /**
   * Body Stat Id
   * ID for the body body_stat entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  body_stat_id: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Note
   * The note of the body body_stat
   * @default null
   * @example "Big weight in today!"
   */
  note?: string | null;
  /**
   * The type of the body_stat
   * @example "weight"
   */
  stat_type: BodyStatType;
  /**
   * Unit
   * The unit of the body body_stat
   * @example "kg"
   */
  unit: MuscleMeasurementUnit | HeightUnit | WeightUnit;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * The ID for the user tracking the body body_stat
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
  /**
   * Value
   * The value of the body body_stat
   * @min 0
   * @example 1
   */
  value: number;
}

/**
 * BooleanOperators
 * Boolean operators for filters.
 */
export enum BooleanOperators {
  Istrue = 'istrue',
  Isfalse = 'isfalse',
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
 * ClientSessionEventCreateSchema
 * Validation schema for the Plan model.
 */
export interface ClientSessionEventCreateSchema {
  /**
   * Application Version
   * The version of the application the client hardware is running
   * @maxLength 50
   * @default null
   * @example "1.0"
   */
  application_version?: string;
  /**
   * Client Session Event Id
   * ID of the user triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  client_session_event_id: string;
  /**
   * Enums relating to the clients
   * connecting to the backend.
   */
  client_type: ClientType;
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Device Id
   * ID of the device triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  device_id: string;
  /**
   * Enum representing client
   * session event types.
   */
  event_type: ClientSessionEventType;
  /**
   * System Version
   * The system version of the client_hardware
   * @maxLength 50
   * @default null
   * @example "11.0"
   */
  system_version?: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Agent
   * The user agent of the client_hardware
   * @maxLength 500
   * @default null
   * @example "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
   */
  user_agent?: string;
  /**
   * User Id
   * The ID for the user triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
}

/**
 * ClientSessionEventType
 * Enum representing client
 * session event types.
 */
export enum ClientSessionEventType {
  LoggedIn = 'logged_in',
  Logout = 'logout',
  AppClose = 'app_close',
  StreakBreak = 'streak_break',
}

/**
 * ClientSessionEventUpdateSchema
 * Validation schema for the Mood model.
 */
export interface ClientSessionEventUpdateSchema {
  /**
   * Application Version
   * The version of the application the client hardware is running
   * @maxLength 50
   * @default null
   * @example "1.0"
   */
  application_version?: string;
  /**
   * Client Session Event Id
   * ID of the user triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  client_session_event_id: string;
  /**
   * Enums relating to the clients
   * connecting to the backend.
   */
  client_type: ClientType;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Device Id
   * ID of the device triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  device_id: string;
  /**
   * Enum representing client
   * session event types.
   */
  event_type: ClientSessionEventType;
  /**
   * System Version
   * The system version of the client_hardware
   * @maxLength 50
   * @default null
   * @example "11.0"
   */
  system_version?: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Agent
   * The user agent of the client_hardware
   * @maxLength 500
   * @default null
   * @example "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
   */
  user_agent?: string;
  /**
   * User Id
   * The ID for the user triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
}

/**
 * ClientType
 * Enums relating to the clients
 * connecting to the backend.
 */
export enum ClientType {
  TRAINER_APP_DEVICE = 'TRAINER_APP_DEVICE',
  TRAINER_APP_WEB = 'TRAINER_APP_WEB',
  USER_APP_DEVICE = 'USER_APP_DEVICE',
  USER_APP_WEB = 'USER_APP_WEB',
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
 * DateTimeOperators
 * Datetime operators for filters.
 */
export enum DateTimeOperators {
  Year = 'year',
  Month = 'month',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second',
}

/**
 * DeviceCreateSchema
 * Schema for validating the device schema
 */
export interface DeviceCreateSchema {
  /**
   * Brand
   * The brand of the client_hardware
   * @maxLength 50
   * @default null
   * @example "Apple"
   */
  brand?: string;
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Device Fcm
   * The firebase cloud management id of the device
   * @maxLength 500
   * @example "eWhHBQQuT2uUuQBa3Hrix...."
   */
  device_fcm: string;
  /**
   * Device Id
   * UUID of the device defined by us
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  device_id: string;
  /**
   * Device Internal Id
   * Unique ID of the device defined by the device itself
   * @maxLength 200
   * @example "dd96dec43fb81c97"
   */
  device_internal_id: string;
  /**
   * Model
   * The model of the device
   * @maxLength 100
   * @default null
   * @example "iPhone7,2"
   */
  model?: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Id
   * The ID for a user using the device
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
}

/**
 * DeviceUpdateSchema
 * Schema for validating the device update schema
 */
export interface DeviceUpdateSchema {
  /**
   * Brand
   * The brand of the client_hardware
   * @maxLength 50
   * @default null
   * @example "Apple"
   */
  brand?: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Device Fcm
   * The firebase cloud management id of the device
   * @maxLength 500
   * @example "eWhHBQQuT2uUuQBa3Hrix...."
   */
  device_fcm: string;
  /**
   * Device Id
   * UUID of the device defined by us
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  device_id: string;
  /**
   * Device Internal Id
   * Unique ID of the device defined by the device itself
   * @maxLength 200
   * @example "dd96dec43fb81c97"
   */
  device_internal_id: string;
  /**
   * Model
   * The model of the device
   * @maxLength 100
   * @default null
   * @example "iPhone7,2"
   */
  model?: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * The ID for a user using the device
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
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
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Created By
   * The ID for the user creating the equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @example "A pair of 10lb dumbbells"
   */
  description: string;
  /**
   * Equipment Id
   * ID of the user triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  equipment_id: string;
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
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Type
   * @default null
   * @example "Dumbbell"
   */
  type?: string | null;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
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
   * Created By
   * The ID for the user creating the equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @example "A pair of 10lb dumbbells"
   */
  description: string;
  /**
   * Equipment Id
   * ID of the user triggering the event
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  equipment_id: string;
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
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
}

/**
 * ExerciseCreateSchema
 * Schema for validating the full exercise schema
 */
export interface ExerciseCreateSchema {
  /**
   * Category
   * @example "JackKnife"
   */
  category: string;
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Created By
   * The ID for the user creating the exercise
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @example "This exercise is a compound exercise"
   */
  description: string;
  /** Difficulty levels. */
  difficulty_level: DifficultyLevel;
  /**
   * Exercise Id
   * Unique uuid for a exercise entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /**
   * Exercise Type
   * @example "Compound"
   */
  exercise_type: string;
  /**
   * Instructions
   * @example "Put the bar on your back and squat"
   */
  instructions: string;
  /** Laterality. */
  laterality: Laterality;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
}

/**
 * ExerciseEquipmentCreateSchema
 * Schema for validating the full exercise_equipment schema
 */
export interface ExerciseEquipmentCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Equipment Id
   * The equipment_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  equipment_id: string;
  /**
   * Exercise Equipment Id
   * Unique uuid for a exercise_equipment entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_equipment_id: string;
  /**
   * Exercise Id
   * The exercise_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
}

/**
 * ExerciseEquipmentUpdateSchema
 * ExerciseEquipmentGetSchema update schema
 */
export interface ExerciseEquipmentUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Equipment Id
   * The equipment_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  equipment_id: string;
  /**
   * Exercise Equipment Id
   * Unique uuid for a exercise_equipment entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_equipment_id: string;
  /**
   * Exercise Id
   * The exercise_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
}

/**
 * ExerciseQueryFilters
 * Represents filtering criteria for querying exercise-related
 * data.
 * This class extends QuerySchema, specifically designed for
 * exercise queries, allowing the specification of equipment,
 * muscle groups, specific muscles, and a search string for more
 * targeted results.
 */
export interface ExerciseQueryFilters {
  /**
   * Equipments
   * @default null
   */
  equipments?: string[] | null;
  /**
   * Musclegroups
   * @default null
   */
  muscleGroups?: string[] | null;
  /**
   * Searchstring
   * @default null
   */
  searchString?: string | null;
  /**
   * Sort
   * The sort to apply to the query
   * @default []
   * @example ["created_at:desc"]
   */
  sort?: any[];
  /**
   * Specificmuscles
   * @default null
   */
  specificMuscles?: string[] | null;
}

/**
 * ExerciseSearchResponse
 * Represents the response schema for an exercise search query,
 * detailing information about both the exercise and associated
 * equipment and bodyparts used.
 */
export interface ExerciseSearchResponse {
  /**
   * Equipment Name
   * Semi Colon seperated list of the Equipment for the exercise
   * @example ["Dumbell"]
   */
  equipment_name: string;
  /**
   * Exercise Id
   * Unique uuid for the exercise
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /** Exercise Name */
  exercise_name: string;
  /**
   * Muscle Group
   * Semi Colon seperated string of (enum)=(MuscleGroups) that the exercise hits
   * @example ["Back"]
   */
  muscle_group: string;
  /**
   * Specific Muscle
   * Semi Colon seperated string of (enum)=(SpecificMuscles) that the exercise hits
   * @example ["Teres Major"]
   */
  specific_muscle: string;
  /**
   * Sub Muscle Group
   * Semi Colon seperated string of (enum)=(SubMuscleGroups) that the exercise hits
   * @example ["Upper Back"]
   */
  sub_muscle_group: string;
}

/**
 * ExerciseSpecificMuscleCreateSchema
 * Schema for validating the full exercise_specific_muscle schema
 */
export interface ExerciseSpecificMuscleCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Exercise Id
   * The exercise_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /**
   * Exercise Specific Muscle Id
   * ID for the set entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_specific_muscle_id: string;
  /**
   * Severity levels. For a set for example you
   * could do number of sets divided by the severity level
   */
  severity: SeverityLevel;
  /**
   * Specific Muscle Id
   * @example 1
   */
  specific_muscle_id: number;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
}

/**
 * ExerciseSpecificMuscleUpdateSchema
 * ExerciseSpecificMuscle update schema
 */
export interface ExerciseSpecificMuscleUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Exercise Id
   * The exercise_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /**
   * Exercise Specific Muscle Id
   * ID for the set entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_specific_muscle_id: string;
  /**
   * Severity levels. For a set for example you
   * could do number of sets divided by the severity level
   */
  severity: SeverityLevel;
  /**
   * Specific Muscle Id
   * @example 1
   */
  specific_muscle_id: number;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
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
   * @example "JackKnife"
   */
  category: string;
  /**
   * Created By
   * The ID for the user creating the exercise
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @example "This exercise is a compound exercise"
   */
  description: string;
  /** Difficulty levels. */
  difficulty_level: DifficultyLevel;
  /**
   * Exercise Id
   * Unique uuid for a exercise entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
  /**
   * Exercise Type
   * @example "Compound"
   */
  exercise_type: string;
  /**
   * Instructions
   * @example "Put the bar on your back and squat"
   */
  instructions: string;
  /** Laterality. */
  laterality: Laterality;
  /**
   * Name
   * @example "Dan's Exercise"
   */
  name: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
}

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
 * MoodCreateSchema
 * Validation schema for the Mood model.
 */
export interface MoodCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * The label of the mood
   * @example "Good"
   */
  label: MoodValue;
  /**
   * Mood Id
   * Unique uuid for a mood entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_id: string;
  /**
   * Note
   * The note of the mood
   * @default null
   * @example "I feel great!"
   */
  note?: string | null;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Id
   * The ID for the user creating the mood
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
  /**
   * Value
   * The value of the mood
   * @min 0
   * @max 6
   * @example 1
   */
  value: number;
}

/**
 * MoodTagCategory
 * Enum relating to the type of
 * tag category.
 * These are the categories that
 * the user can create tags for.
 */
export enum MoodTagCategory {
  Sleep = 'sleep',
  Work = 'work',
  School = 'school',
  Productivity = 'productivity',
  Exercise = 'exercise',
  Hobbies = 'hobbies',
  Chores = 'chores',
  Beauty = 'beauty',
  BadHabits = 'bad_habits',
  Emotions = 'emotions',
  MenstrualCycle = 'menstrual_cycle',
  Health = 'health',
  Social = 'social',
  Relationships = 'relationships',
  News = 'news',
  Places = 'places',
  Weather = 'weather',
}

/**
 * MoodTagCreateSchema
 * Validation schema for the MoodTag model.
 */
export interface MoodTagCreateSchema {
  /**
   * The category of the mood_tag
   * @example "social"
   */
  category: MoodTagCategory;
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Icon
   * The icon of the mood_tag
   * @maxLength 50
   * @example "mdi-emoticon-happy"
   */
  icon: string;
  /**
   * Label
   * The label of the mood_tag
   * @maxLength 100
   * @example "Met with friends"
   */
  label: string;
  /**
   * Mood Tag Id
   * Unique uuid for a mood_tag entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_tag_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Id
   * The ID for the user creating the mood_tag
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
}

/**
 * MoodTagLinkCreateSchema
 * Validation schema for the MoodTagLink model.
 */
export interface MoodTagLinkCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Mood Id
   * The mood_id of the mood_tag_link
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_id: string;
  /**
   * Mood Tag Id
   * The mood_tag_id of the mood_tag_link
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_tag_id: string;
  /**
   * Mood Tag Link Id
   * Unique uuid for a mood_tag_link entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_tag_link_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
}

/**
 * MoodTagLinkUpdateSchema
 * Validation schema for the MoodTagLink model.
 */
export interface MoodTagLinkUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Mood Id
   * The mood_id of the mood_tag_link
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_id: string;
  /**
   * Mood Tag Id
   * The mood_tag_id of the mood_tag_link
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_tag_id: string;
  /**
   * Mood Tag Link Id
   * Unique uuid for a mood_tag_link entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_tag_link_id: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
}

/**
 * MoodTagUpdateSchema
 * Validation schema for the Mood model.
 */
export interface MoodTagUpdateSchema {
  /**
   * The category of the mood_tag
   * @example "social"
   */
  category: MoodTagCategory;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Icon
   * The icon of the mood_tag
   * @maxLength 50
   * @example "mdi-emoticon-happy"
   */
  icon: string;
  /**
   * Label
   * The label of the mood_tag
   * @maxLength 100
   * @example "Met with friends"
   */
  label: string;
  /**
   * Mood Tag Id
   * Unique uuid for a mood_tag entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_tag_id: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * The ID for the user creating the mood_tag
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
}

/**
 * MoodUpdateSchema
 * Validation schema for the Mood model.
 */
export interface MoodUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * The label of the mood
   * @example "Good"
   */
  label: MoodValue;
  /**
   * Mood Id
   * Unique uuid for a mood entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  mood_id: string;
  /**
   * Note
   * The note of the mood
   * @default null
   * @example "I feel great!"
   */
  note?: string | null;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * The ID for the user creating the mood
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
  /**
   * Value
   * The value of the mood
   * @min 0
   * @max 6
   * @example 1
   */
  value: number;
}

/**
 * MoodValue
 * Mood labels.
 */
export enum MoodValue {
  Awful = 'Awful',
  VeryBad = 'Very Bad',
  Bad = 'Bad',
  Neutral = 'Neutral',
  Good = 'Good',
  VeryGood = 'Very Good',
  Amazing = 'Amazing',
}

/**
 * MuscleGroup
 * Muscle groups
 */
export enum MuscleGroup {
  Chest = 'Chest',
  Shoulders = 'Shoulders',
  Back = 'Back',
  UpperArms = 'Upper Arms',
  LowerArms = 'Lower Arms',
  UpperLegs = 'Upper Legs',
  LowerLegs = 'Lower Legs',
  Core = 'Core',
  Neck = 'Neck',
}

/**
 * MuscleGroupGetSchema
 * MuscleGroup get schema
 */
export interface MuscleGroupGetSchema {
  /**
   * Muscle Group Id
   * @example 1
   */
  muscle_group_id: number;
  /** Muscle groups */
  name: MuscleGroup;
}

/**
 * MuscleMeasurementUnit
 * Muscle measurement units.
 */
export enum MuscleMeasurementUnit {
  Cm = 'cm',
  Inch = 'inch',
}

/**
 * NumericOperators
 * Numeric operators for filters.
 */
export enum NumericOperators {
  Lt = 'lt',
  Le = 'le',
  Gt = 'gt',
  Ge = 'ge',
}

/**
 * NutritionCreateSchema
 * Validation schema for the Nutrition model.
 */
export interface NutritionCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Nutrition Id
   * Unique uuid for a nutrition entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  nutrition_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * The type of the nutrition entry
   * @example "water"
   */
  type: NutritionType;
  /**
   * Unit
   * The unit of the nutrition entry
   * @maxLength 50
   * @example "ml"
   */
  unit: WaterUnit | NutritionWeightUnit | CaloriesUnit;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Id
   * The ID for the user creating the nutrition entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
  /**
   * Value
   * The value of the nutrition entry
   * @min 0
   * @example 52
   */
  value: number;
}

/**
 * NutritionType
 * Nutrition types.
 */
export enum NutritionType {
  Water = 'water',
  Calories = 'calories',
  Protein = 'protein',
  Carbohydrates = 'carbohydrates',
  Fat = 'fat',
  Fiber = 'fiber',
}

/**
 * NutritionUpdateSchema
 * A class representing the schema for updating nutrition entries,
 * inheriting from BodyStatCreateSchema and SyncUpdateSchema.
 */
export interface NutritionUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Nutrition Id
   * Unique uuid for a nutrition entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  nutrition_id: string;
  /**
   * The type of the nutrition entry
   * @example "water"
   */
  type: NutritionType;
  /**
   * Unit
   * The unit of the nutrition entry
   * @maxLength 50
   * @example "ml"
   */
  unit: WaterUnit | NutritionWeightUnit | CaloriesUnit;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * The ID for the user creating the nutrition entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
  /**
   * Value
   * The value of the nutrition entry
   * @min 0
   * @example 52
   */
  value: number;
}

/**
 * NutritionWeightUnit
 * Nutrition weight units.
 */
export enum NutritionWeightUnit {
  Mg = 'mg',
  G = 'g',
  Oz = 'oz',
}

/**
 * PlanComponentCreateSchema
 * Validation schema for the Plan Component model.
 */
export interface PlanComponentCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * ID for the plan component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_component_id: string;
  /**
   * Plan Id
   * The ID of the plan this plan component belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
}

/**
 * PlanComponentTreeCreateSchema
 * A tree version of the SetCreateSchema where
 * all child components are included nested within set.
 * The set in this case is not nested within the workout componet.
 * It is the root of the workout tree. So the 'workout_component_id' is
 * required.
 */
export interface PlanComponentTreeCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * ID for the plan component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_component_id: string;
  /**
   * Plan Id
   * The ID of the plan this plan component belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /** Workouts */
  workouts: WorkoutTreeCreateSchema[];
}

/**
 * PlanComponentUpdateSchema
 * Validation schema for the Plan Component model.
 */
export interface PlanComponentUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * ID for the plan component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_component_id: string;
  /**
   * Plan Id
   * The ID of the plan this plan component belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_id: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
}

/**
 * PlanCreateSchema
 * Validation schema for the Plan model.
 */
export interface PlanCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Created By
   * The ID for the user creating the plan
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * ID for the plan entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
}

/**
 * PlanTreeCreateSchema
 * A tree version of the SetCreateSchema where
 * all child components are included nested within set.
 * The set in this case is not nested within the workout componet.
 * It is the root of the workout tree. So the 'workout_component_id' is
 * required.
 */
export interface PlanTreeCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Created By
   * The ID for the user creating the plan
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
  /** Plan Components */
  plan_components: PlanComponentTreeCreateSchema[];
  /**
   * Plan Id
   * ID for the plan entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_id: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
}

/**
 * PlanUpdateSchema
 * Validation schema for the Plan model.
 */
export interface PlanUpdateSchema {
  /**
   * Created By
   * The ID for the user creating the plan
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * ID for the plan entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_id: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
}

/**
 * ProfileStatus
 * Enum for user status
 */
export enum ProfileStatus {
  Active = 'active',
  Inactive = 'inactive',
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
   * @example {"body_stat_id":{"eq":1}}
   */
  filters?: object;
  /**
   * Sort
   * The sort to apply to the query
   * @default []
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
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * The exercise_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
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
   * ID for the body body_stat entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_component_id: string;
  /**
   * Set Id
   * The set_id of the set_component
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_id: string;
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
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
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
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * The exercise_id of the exercise_equipment
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  exercise_id: string;
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
   * ID for the body body_stat entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_component_id: string;
  /**
   * Set Id
   * The set_id of the set_component
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_id: string;
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
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
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
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @default null
   * @example "This is a straight set"
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
   * @example "Dan's straight set"
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
   * Set Id
   * ID for the set entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_id: string;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Workout Component Id
   * The ID of the workout component this set belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_component_id: string;
}

/**
 * SetTreeCreateSchema
 * A tree version of the SetCreateSchema where
 * all child components are included nested within set.
 * The set in this case is not nested within the workout componet.
 * It is the root of the workout tree. So the 'workout_component_id' is
 * required.
 */
export interface SetTreeCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @default null
   * @example "This is a straight set"
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
   * @example "Dan's straight set"
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
  /** Set Components */
  set_components: SetComponentCreateSchema[];
  /**
   * Set Id
   * ID for the set entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_id: string;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Workout Component Id
   * The ID of the workout component this set belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_component_id: string;
}

/**
 * SetUpdateSchema
 * Schema to validate the set update schema
 */
export interface SetUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
  /**
   * Description
   * @default null
   * @example "This is a straight set"
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
   * @example "Dan's straight set"
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
   * Set Id
   * ID for the set entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  set_id: string;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * Workout Component Id
   * The ID of the workout component this set belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_component_id: string;
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
 * SpecificMuscleGetSchema
 * MuscleGroup get schema
 */
export interface SpecificMuscleGetSchema {
  /** Sub muscle groups */
  name: SpecificMuscles;
  /**
   * Specific Muscle Id
   * @example 1
   */
  specific_muscle_id: number;
  /**
   * Sub Muscle Group Id
   * @example 1
   */
  sub_muscle_group_id: number;
}

/**
 * SpecificMuscles
 * Sub muscle groups
 */
export enum SpecificMuscles {
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
  Sartorius = 'Sartorius',
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
  Subscapularis = 'Subscapularis',
}

/**
 * StringOperators
 * String operators for filters.
 */
export enum StringOperators {
  Contains = 'contains',
  Startswith = 'startswith',
  Endswith = 'endswith',
  Like = 'like',
}

/**
 * SubMuscleGroup
 * Sub muscle groups
 */
export enum SubMuscleGroup {
  UpperChest = 'Upper Chest',
  LowerChest = 'Lower Chest',
  MiddleChest = 'Middle Chest',
  FrontDeltoid = 'Front Deltoid',
  SideDeltoid = 'Side Deltoid',
  RearDeltoid = 'Rear Deltoid',
  ScapularStabilizers = 'Scapular Stabilizers',
  RotatorCuff = 'Rotator Cuff',
  UpperBack = 'Upper Back',
  MiddleBack = 'Middle Back',
  LowerBack = 'Lower Back',
  Bicep = 'Bicep',
  Triceps = 'Triceps',
  ForearmExtensors = 'Forearm Extensors',
  ForearmFlexors = 'Forearm Flexors',
  ForearmRotationAndElbowFlexion = 'Forearm Rotation and Elbow Flexion',
  Hamstrings = 'Hamstrings',
  Quadriceps = 'Quadriceps',
  Abductors = 'Abductors',
  Adductors = 'Adductors',
  HipFlexors = 'Hip Flexors',
  Glutes = 'Glutes',
  Calves = 'Calves',
  Abdominals = 'Abdominals',
  Obliques = 'Obliques',
  Neck = 'Neck',
}

/**
 * SubMuscleGroupGetSchema
 * MuscleGroup get schema
 */
export interface SubMuscleGroupGetSchema {
  /**
   * Muscle Group Id
   * @example 1
   */
  muscle_group_id: number;
  /** Sub muscle groups */
  name: SubMuscleGroup;
  /**
   * Sub Muscle Group Id
   * @example 1
   */
  sub_muscle_group_id: number;
}

/**
 * SyncErrorDumpCreateSchema
 * Schema for creating a synchronization error dump entry.
 *
 * Represents the data structure expected when creating an entry
 * in the synchronization error dump table.
 *
 * Attributes:
 *     table_name (str): The name of the table associated with
 *         the failed synchronization push error.
 *     row_id (str): The unique identifier of the row associated
 *         with the failed synchronization push error.
 *     data (str): The actual data of the failed
 *         synchronization push error.
 *
 * Inherits from:
 *     SyncCreateSchema: Base schema for creating synchronization entries.
 */
export interface SyncErrorDumpCreateSchema {
  /**
   * Created At
   * @default null
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at?: string | null;
  /**
   * Error Data
   * The actual data of the failed synchronization push error.
   * @example {"error_message":"Invalid data","field":"value"}
   */
  data: object;
  /**
   * Row ID
   * The unique identifier of the row associated with the failed synchronization push error.
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  row_id: string;
  /**
   * Enum relating to the type of
   * sync operation being processed.
   * Can either be 'creates' realting
   * to newly created rows not yet synced
   * or 'updates', being newly updated rows
   * not yet synced.
   */
  sync_operation: SyncOperation;
  /**
   * Enum relating to the type
   * of sync be it pulling from a destination
   * or pushing to a destination.
   */
  sync_type: SyncType;
  /**
   * Table Name
   * The name of the table associated with the failed synchronization push error.
   * @example "muscle_group"
   */
  table_name: string;
  /**
   * Timezone
   * @default null
   * @example "UTC"
   */
  timezone?: string | null;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
}

/**
 * SyncOperation
 * Enum relating to the type of
 * sync operation being processed.
 * Can either be 'creates' realting
 * to newly created rows not yet synced
 * or 'updates', being newly updated rows
 * not yet synced.
 */
export enum SyncOperation {
  Creates = 'creates',
  Updates = 'updates',
}

/**
 * SyncType
 * Enum relating to the type
 * of sync be it pulling from a destination
 * or pushing to a destination.
 */
export enum SyncType {
  Pull = 'pull',
  Push = 'push',
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
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /** Accepted date formats. */
  date_format_pref: DateFormat;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * @maxLength 500
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
  premium?: boolean | null;
  /** @default "active" */
  status?: ProfileStatus;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * User Id
   * Unique uuid for a user entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
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
  /** Accepted date formats. */
  date_format_pref: DateFormat;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
  premium?: boolean | null;
  /** @default "active" */
  status?: ProfileStatus;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * User Id
   * Unique uuid for a user entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  user_id: string;
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
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Workout Component Id
   * ID for the workout component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_component_id: string;
  /**
   * Workout Id
   * The ID of the workout this component belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_id: string;
}

/**
 * WorkoutComponentTreeCreateSchema
 * A tree version of the WorkoutComponentCreateSchema where
 * all child components are included nested within the workout component.
 * The workout component in this case is not nested within the workout.
 * It is the root of the workout tree. So the 'workout_id' is
 * required.
 */
export interface WorkoutComponentTreeCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Workout Component Id
   * ID for the workout component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_component_id: string;
  /**
   * Workout Id
   * The ID of the workout this component belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_id: string;
}

/**
 * WorkoutComponentUpdateSchema
 * Schema to validate the workout update schema
 */
export interface WorkoutComponentUpdateSchema {
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * Workout Component Id
   * ID for the workout component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_component_id: string;
  /**
   * Workout Id
   * The ID of the workout this component belongs to
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_id: string;
}

/**
 * WorkoutCreateSchema
 * Schema for validating the full workout schema
 */
export interface WorkoutCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Created By
   * The ID for the user creating the workout
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * The ID of the plan component this workout belongs to
   * @default null
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_component_id?: string | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
  /**
   * Workout Id
   * ID for the workout component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_id: string;
}

/**
 * WorkoutTreeCreateSchema
 * A tree version of the WorkoutCreateSchema where
 * all child components are included nested within the workout.
 * The workout in this case is not nested within the plan component.
 * It is the root of the workout tree. So the 'plan_component_id' is
 * required.
 */
export interface WorkoutTreeCreateSchema {
  /**
   * Created At
   * @format date-time
   * @example "2024-12-18T12:00:00.000Z"
   */
  created_at: string;
  /**
   * Created By
   * The ID for the user creating the workout
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * The ID of the plan component this workout belongs to
   * @default null
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_component_id?: string | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Timezone
   * @example "UTC"
   */
  timezone: string;
  /**
   * Updated At
   * @default null
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at?: string | null;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
  /** Workout Components */
  workout_components: WorkoutComponentTreeCreateSchema[];
  /**
   * Workout Id
   * ID for the workout component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_id: string;
}

/**
 * WorkoutUpdateSchema
 * Schema to validate the workout update schema
 */
export interface WorkoutUpdateSchema {
  /**
   * Created By
   * The ID for the user creating the workout
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  created_by: string;
  /**
   * Deleted
   * @default false
   * @example false
   */
  deleted?: boolean | null;
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
   * The ID of the plan component this workout belongs to
   * @default null
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  plan_component_id?: string | null;
  /**
   * Start Time
   * @format date-time
   * @example "2021-05-18T12:00:00"
   */
  start_time: string;
  /**
   * Updated At
   * @format date-time
   * @example "2024-12-18T12:01:00.000Z"
   */
  updated_at: string;
  /**
   * Verified
   * @default false
   */
  verified?: boolean | null;
  /**
   * Workout Id
   * ID for the workout component entry
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   * @example "16945c77-6076-4dce-8921-7db976327923"
   */
  workout_id: string;
}
