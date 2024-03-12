import {WeightUnit} from '@services/api/swagger/data-contracts';

/**
 * Enum representing database table names.
 *
 * @enum {string}
 * @readonly
 * @property {string} syncTable - Represents db tables.
 */
export enum otherDbTables {
  syncTable = 'sync_table',
  SyncErrorDumpTable = 'sync_error_dump',
}

/**
 * Enum representing database sync table names.
 *
 * @enum {string}
 * @readonly
 * @property {string} bodyStatTable - Represents the statistics table.
 */
export enum syncDbTables {
  userTable = 'user',
  bodyStatTable = 'body_stat',
  moodTable = 'mood',
  moodTagTable = 'mood_tag',
  moodTagLinkTable = 'mood_tag_link',
  nutritionTable = 'nutrition',
  deviceTable = 'device',
  clientSessionEventTable = 'client_session_event',
}

/**
 * The maximum number of rows to be processed in a single synchronization batch.
 *
 * @constant
 * @type {number}
 * @default 100
 */
export const syncBatchLimit: number = 100;

/**
 * Enum representing timestamp fields in database tables.
 * @enum {string}
 * @readonly
 * @property {string} createdAt - Represents the creation timestamp field.
 * @property {string} updatedAt - Represents the last update timestamp field.
 * @property {string} timezone - Represents the timezone field.
 */
export enum timestampFields {
  createdAt = 'created_at',
  updatedAt = 'updated_at',
  timezone = 'timezone',
}

export const unixEpoch: string = '1970-01-01T00:00:00.000';

export enum SortOrders {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum timestampColumns {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum AndOrOperatos {
  OR = 'or',
  AND = 'and',
}

type MaxWeightValues = {
  [key in WeightUnit]: number;
};

export const maxWeighValues: MaxWeightValues = {
  [WeightUnit.Lbs]: 1400, // Heaviest person ever recorded
  [WeightUnit.Kg]: 635.0293,
  [WeightUnit.Stone]: 100,
};
