import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncBatchLimit, timestampFields} from '@shared/Constants';

/**
 * Generates a SQL query to retrieve the last synced timestamp for a given table and Sync type.
 *
 * @param {string} tableName - The name of the table to retrieve last synced timestamp for.
 * @param {SyncType} syncType - The type of synchronization (e.g., 'full', 'incremental').
 * @returns {string} SQL query to retrieve last synced timestamp.
 */

export const getLastSyncedForTableQuery = (
  tableName: string,
  syncType: SyncType,
): string => `
    SELECT last_synced, sync_operation
    FROM sync_table
    WHERE table_name = '${tableName}' AND sync_type = '${syncType}' ORDER BY sync_operation;
`;

/**
 * Generates a SQL query to retrieve rows to sync for push operation based on the specified criteria.
 *
 * @param {string} tableName - The name of the table to retrieve rows from.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @param {string} lastSyncedCreates - The timestamp of the last sync for creations.
 * @param {string} lastSyncedUpdates - The timestamp of the last sync for updates.
 * @param {string} syncStart - The timestamp representing the start of the current Sync operation.
 * @returns {string} SQL query to retrieve rows for push synchronization.
 */

export const getRowsToSyncPushQuery = (
  tableName: string,
  syncOperation: SyncOperation,
  lastSyncedCreates: string,
  lastSyncedUpdates: string,
  syncStart: string,
): string => {
  let query = `
    SELECT *
    FROM ${tableName}
  `;

  if (syncOperation === SyncOperation.Creates) {
    // Return all the rows created between the last sync and the current sync's time
    query += ` WHERE ${timestampFields.createdAt} > '${lastSyncedCreates}' AND ${timestampFields.createdAt} <= '${syncStart}'`;
    query += ` ORDER BY ${timestampFields.createdAt} ASC LIMIT ${syncBatchLimit};`;
  } else {
    // Return all the rows updated between the last sync and the current sync's time excluding rows that have been created in this
    // time as they'll already have been pushed
    query += ` WHERE ${timestampFields.updatedAt} > '${lastSyncedUpdates}' `;
    query += `AND ${timestampFields.createdAt} <= '${lastSyncedCreates}' AND ${timestampFields.updatedAt} <= '${syncStart}'`;
    query += ` ORDER BY ${timestampFields.updatedAt} ASC LIMIT ${syncBatchLimit};`;
  }
  return query;
};

/**
 * Constructs a SQL query to retrieve a row by its UUID from a specified table.
 * @param tableName - The name of the table from which to retrieve the row.
 * @param uuid - The UUID of the row to be retrieved.
 * @param idColumn - Optional. The column representing the UUID in the table.
 *                   Defaults to `${tableName}_id` if not provided.
 * @returns A SQL query string with placeholders for parameters.
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
