/**
 * Enum representing database table names.
 *
 * @enum {string}
 * @readonly
 * @property {string} syncTable - Represents db tables.
 *
 * @example
 * // Example usage:
 * const tableName: otherDbTables = otherDbTables.syncTable;
 * logger.info(`Selected table: ${tableName}`);
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
 *
 * @example
 * // Example usage:
 * const tableName: syncDbTables = syncDbTables.statTable;
 * logger.info(`Selected table: ${tableName}`);
 */
export enum syncDbTables {
  statTable = 'stat',
  moodTable = 'mood',
  moodTagTable = 'mood_tag',
  moodTagLinkTable = 'mood_tag_link',
  nutritionTable = 'nutrition',
}

/**
 * The maximum number of rows to be processed in a single synchronization batch.
 *
 * @constant
 * @type {number}
 * @default 100
 *
 * @example
 * // Example usage:
 * const batchSize: number = syncBatchLimit;
 * logger.info(`Synchronization batch size: ${batchSize}`);
 */
export const syncBatchLimit: number = 100;

/**
 * Enum representing timestamp fields in database tables.
 *
 * @enum {string}
 * @readonly
 * @property {string} createdAt - Represents the creation timestamp field.
 * @property {string} updatedAt - Represents the last update timestamp field.
 * @property {string} timezone - Represents the timezone field.
 *
 * @example
 * // Example usage:
 * const timestampField: timestampFields = timestampFields.updatedAt;
 * logger.info(`Selected timestamp field: ${timestampField}`);
 */
export enum timestampFields {
  createdAt = 'created_at',
  updatedAt = 'updated_at',
  timezone = 'timezone',
}

export const unixEpoch: string = '1970-01-01T00:00:00.000';
