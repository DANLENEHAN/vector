import {SyncOperation, SyncType} from '@shared/enums';
import {syncBatchLimit, timestampFields} from '@shared/Constants';

/**
 * Generate a SQL query to retrieve the last synced timestamp for a specific table, sync type, and sync operation.
 *
 * @param {string} tableName - The name of the table to retrieve the last synced timestamp for.
 * @param {SyncType} syncType - The type of synchronization (e.g., Push, Pull).
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @returns {string} A SQL query string.
 */
export const getLastSyncedForTableQuery = (
  tableName: string,
  syncType: SyncType,
  syncOperation: SyncOperation,
): string => `
    SELECT last_synced
    FROM sync_table
    WHERE table_name = '${tableName}' AND sync_type = '${syncType}' AND sync_operation = '${syncOperation}';
`;

/**
 * Generate a SQL query to retrieve rows for synchronization for a specific table and sync operation.
 *
 * @param {string} tableName - The name of the table to retrieve rows for synchronization.
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @param {string | null} lastSyncTime - Optional timestamp to filter rows updated since the last sync.
 * @returns {string} A SQL query string.
 */
export const getRowsToSyncQuery = (
  tableName: string,
  syncOperation: SyncOperation,
  lastSyncTime: string | null,
): string => {
  let query = `
    SELECT *
    FROM ${tableName}
  `;

  const timestampField =
    syncOperation === SyncOperation.Creates
      ? timestampFields.createdAt
      : timestampFields.updatedAt;

  if (lastSyncTime !== null) {
    query += `WHERE ${timestampField} > '${lastSyncTime}' `;
  } else {
    // In the event there's been no sync for this type yet
    // Will just get all creates or updates
    query += `WHERE ${timestampField} IS NOT NULL `;
  }

  query += ` ORDER BY ${timestampField} ASC LIMIT ${syncBatchLimit};`;
  return query;
};

/**
 * Constructs a SQL query to retrieve a row by its UUID from a specified table.
 *
 * @param tableName - The name of the table from which to retrieve the row.
 * @param uuid - The UUID of the row to be retrieved.
 * @param idColumn - Optional. The column representing the UUID in the table.
 *                   Defaults to `${tableName}_id` if not provided.
 * @returns A SQL query string with placeholders for parameters.
 *
 * @example
 * // Example usage:
 * const tableName = 'my_table';
 * const uuid = 'some-uuid';
 * const query = getRowByIdQuery(tableName, uuid);
 * // Execute the query using your database library and provide the UUID as a parameter.
 */
export const getRowByIdQuery = (
  tableName: string,
  uuid: string,
  idColumn?: string,
) => {
  if (idColumn === undefined) {
    idColumn = `${tableName}_id`;
  }
  return `SELECT * FROM ${tableName} WHERE ${idColumn} = '${uuid}';`;
};
