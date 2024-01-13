import {SyncOperation, SyncType} from 'src/shared/enums';
import {syncBatchLimit} from 'src/shared/contants';

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
 * @param {string | undefined} lastSyncTime - Optional timestamp to filter rows updated since the last sync.
 * @returns {string} A SQL query string.
 */
export const getRowsToSyncQuery = (
  tableName: string,
  syncOperation: SyncOperation,
  lastSyncTime?: string,
): string => {
  let query = `
    SELECT *
    FROM ${tableName}
  `;

  const timestampField =
    syncOperation === SyncOperation.Creates ? 'created_at' : 'updated_at';

  if (lastSyncTime !== undefined) {
    query += `WHERE ${timestampField} > '${lastSyncTime}' `;
  } else {
    // In the event there's been no sync for this type yet
    // Will just get all creates or updates
    query += `WHERE ${timestampField} IS NOT NULL `;
  }

  query += ` ORDER BY created_at ASC, updated_at ASC LIMIT ${syncBatchLimit};`;
  return query;
};
