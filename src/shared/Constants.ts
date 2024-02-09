/**
 * Enum representing database table names.
 *
 * @enum {string}
 * @readonly
 * @property {string} syncTable - Represents db tables.
 */
export enum otherDbTables {
  syncTable = 'sync_table',
}

/**
 * Enum representing database sync table names.
 *
 * @enum {string}
 * @readonly
 * @property {string} statTable - Represents the statistics table.
 */
export enum syncDbTables {
  statTable = 'body_stat',
  moodTable = 'mood',
  moodTagTable = 'mood_tag',
  moodTagLinkTable = 'mood_tag_link',
  nutritionTable = 'nutrition',
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
