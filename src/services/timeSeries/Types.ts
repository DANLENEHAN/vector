import {
  BodyStatCreateSchema,
  MoodCreateSchema,
  NutritionCreateSchema,
} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {Moment} from 'moment';

/**
 * @description Represents a schema for data that can be synchronized during a create operation.
 * @typedef {BodyStatCreateSchema | MoodCreateSchema | NutritionCreateSchema} SyncCreateSchemas
 */
export type SchemaMapping = {
  [syncDbTables.moodTable]: MoodCreateSchema;
  [syncDbTables.bodyStatTable]: BodyStatCreateSchema;
  [syncDbTables.nutritionTable]: NutritionCreateSchema;
};
/**
 * @description Gets the schema type for a given table.
 */
export type GetSchemaType<T extends keyof SchemaMapping> = SchemaMapping[T];

/**
 * @description Use this type to get the necessary schema for a given table.
 */
export const FieldMapping = {
  [syncDbTables.moodTable]: {
    valueColumn: 'value',
    // Uses this as the unit value for all values
    unitValue: 'mood unit',
  },
  [syncDbTables.bodyStatTable]: {
    valueColumn: 'value',
    // Gets the units from this column
    unitColumn: 'unit',
  },
  [syncDbTables.nutritionTable]: {
    valueColumn: 'value',
    unitColumn: 'unit',
  },
};

/**
 * @description Raw data point converted from the database.
 */
export interface dataPoint {
  value: number;
  date: string;
  unit: string;
}

/**
 * @description Data point that will be used in the graph.
 */
export type graphDataPoint = {
  value: number | null;
  index: number;
  startDate: number;
  endDate: number;
  showLabel: boolean;
  unit: string;
  label: string;
  axisLabel: string;
  numberOfDataPoints: number;
};

/**
 * @description Full graph data object.
 */
export interface graphData {
  data: graphDataPoint[];
  averagePeriodLabel: string;
  averageValue: number | null;
  unit: string;
}

/**
 * @description Acceptable time periods for the graph.
 */
export type timePeriods = 'day' | 'week' | 'month' | 'halfYear' | 'year';

/**
 * @description Mapping of time period labels to their respective time periods.
 */
type timePeriodLabel = {
  [key: string]: timePeriods;
};

/**
 * @description Mappings used for the date range selection.
 * Key is the time period used in selectpr, value is period used for data retrieval.
 */
export const timePeriodLabels: timePeriodLabel = {
  D: 'day',
  W: 'week',
  M: 'month',
  '6M': 'halfYear',
  Y: 'year',
};

/**
 * @description Object to map time periods to their respective start and end date functions.
 */
export type timePeriodLookbacksMappings = {
  [key in timePeriods]: {
    getStart: (date: Moment) => Moment;
    getEnd: (date: Moment) => Moment;
  };
};

/**
 * @description Object to represent lenght of each interval within period
 */
type interval = {
  value: number;
  cadence: 'hour' | 'days' | 'weeks' | 'months';
};

/**
 * @description Object to map time periods to their respective interval lengths.
 */
export type intervalLengthsMappings = {
  [key in timePeriods]: interval;
};

/**
 * @description Object to map time periods to their respective interval lengths.
 */
export type intervalDates = {
  startDate: number;
  endDate: number;
};

/**
 * @description Function to generate labels for the graph.
 */
type labelGenerator = (args: intervalDates) => string;

/**
 * @description Object to map time periods to their respective label generation functions.
 */
export type labelGenerators = {
  [key in timePeriods]: labelGenerator;
};

/**
 * @description Object to represent how apart labels will be interms of intervals
 */
export type labelGap = {
  [key in timePeriods]: number;
};

/**
 * @description Object to map time periods to the data for the graph for that period.
 */
export type graphPeriodData = Record<timePeriods, graphData>;
