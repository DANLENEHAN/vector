// Typing
import {SyncTable, SyncCreateSchemas, SyncUpdateSchemas} from './Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@shared/Enums';
import {otherDbTables, syncDbTables, timestampFields} from '@shared/Constants';
import {RowData} from '@services/db/Types';

// Functions
import {runSqlSelect, executeSqlNonQuery} from '@services/db/Functions';
import {
  getLastSyncedForTableQuery,
  getRowsToSyncQuery,
} from '@services/db/sync/Queries';

// Constants
import {unixEpoch} from '@shared/Constants';

/**
 * Retrieve the last synced timestamp for a specific table based on sync type and operation.
 *
 * @param {string} tableName - The name of the table to retrieve the last synced timestamp for.
 * @param {SyncType} syncType - The type of synchronization (e.g., Push, Pull).
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @returns {Promise<string>} A promise that resolves to the last synced timestamp as a string.
 * @throws {Error} If there is an issue with the database transaction or SQL execution.
 */
export const getLastSyncedForTable = async (
  tableName: syncDbTables,
  syncType: SyncType,
  syncOperation: SyncOperation,
): Promise<string | null> => {
  const response: RowData[] = await runSqlSelect(
    getLastSyncedForTableQuery(tableName, syncType, syncOperation),
    [],
  );
  return response.length > 0 ? response[0].last_synced : null;
};

/**
 * Retrieve rows to be synchronized for a specific table and sync operation.
 *
 * @param {string} tableName - The name of the table to retrieve rows for synchronization.
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @param {string | null} lastSyncTime - Optional timestamp to filter rows updated since the last sync.
 * @returns {Promise<(SyncCreateSchemas | SyncUpdateSchemas)[]>} A promise that resolves to an array
 *   of schemas representing rows to be synchronized.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const getRowsToSync = async (
  tableName: syncDbTables,
  syncOperation: SyncOperation,
  lastSyncTime: string | null,
): Promise<SyncCreateSchemas[]> => {
  return await runSqlSelect(
    getRowsToSyncQuery(tableName, syncOperation, lastSyncTime),
    [],
  );
};

/**
 * Insert or replace a synchronization update record into the sync table.
 *
 * @param {SyncTable} syncUpdate - The synchronization update to be inserted or replaced.
 * @returns {Promise<void>} A promise that resolves when the insertion or replacement is successful.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const insertSyncUpdate = async (
  syncUpdate: SyncTable,
): Promise<void> => {
  const columns = `(${Object.keys(syncUpdate)
    .map(key => `'${key}'`)
    .join(', ')})`;
  const insertValues = `(${Object.keys(syncUpdate)
    .map(() => '?')
    .join(', ')})`;

  const response: number = await executeSqlNonQuery(
    `INSERT OR REPLACE INTO ${otherDbTables.syncTable} ${columns} VALUES ${insertValues};`,
    Object.values(syncUpdate),
  );
  if (response !== 1) {
    throw new Error(
      `Failed to insert or replace SyncUpdate. No ${response} rows affected.`,
    );
  }
};

export function convertListToSyncUpdateSchemas(
  createSchemasList: SyncCreateSchemas[],
): SyncUpdateSchemas[] {
  return createSchemasList.map(createSchema => {
    const {created_at, timezone, ...rest} = createSchema;
    // remove the below at somepoint
    created_at;
    timezone;
    return rest as SyncUpdateSchemas;
  });
}

/**
 * Asynchronously generates a query schema based on the last synced timestamp and the specified synchronization operation.
 *
 * @param lastSynced - The last synced timestamp for the table. Pass `null` if no previous synchronization has occurred.
 * @param syncOperation - The synchronization operation to determine the timestamp field (creates or updates).
 *
 * @returns A Promise that resolves to a QuerySchema representing the conditions for retrieving rows from the table.
 *
 * @throws {Error} If an unexpected error occurs during the query schema generation.
 *
 * @example
 * // Example usage:
 * const lastSyncedTimestamp = '2023-01-01T00:00:00Z';
 * const syncOperation = SyncOperation.Creates;
 * const querySchema = await getQueryObjForTable(lastSyncedTimestamp, syncOperation);
 * // Output: { filters: { created_at: { gt: '2023-01-01T00:00:00Z' } }, sort: ['created_at:asc'] }
 */
export const getQueryObjForTable = async (
  lastSynced: string | null,
  syncOperation: SyncOperation,
): Promise<QuerySchema> => {
  // Get the last synced timestamp for the table

  // Determine the timestamp field based on the sync type
  const timestampField =
    syncOperation === SyncOperation.Creates
      ? timestampFields.createdAt
      : timestampFields.updatedAt;

  // Define the condition for the timestamp field
  lastSynced = lastSynced === null ? unixEpoch : lastSynced;
  const condition = lastSynced === undefined ? {ne: null} : {gt: lastSynced};

  // Construct and return the query schema
  return {
    filters: {
      [timestampField]: condition,
    },
    sort: [`${timestampField}:asc`],
  } as QuerySchema;
};
