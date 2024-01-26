// Typing
import {AxiosResponse} from 'axios';
import {SyncTableFunctions, SyncCreateSchemas} from './Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@shared/Enums';
import {syncDbTables, timestampFields} from '@shared/Constants';

// Functions
import {
  getLastSyncedForTable,
  getRowsToSync,
  getQueryObjForTable,
  insertSyncUpdate,
} from '@services/db/sync/SyncUtils';
import {insertRows, updateRows, runSqlSelect} from '@services/db/Functions';
import {
  processCreatesSyncTypePush,
  processUpdatesSyncTypePush,
} from '@services/db/sync/SyncOperations';

// Logger
import logger from '@utils/Logger';

/**
 * Process a synchronization pull operation for a specific table.
 *
 * @param {syncDbTables} tableName - The name of the table to sync.
 * @param {SyncTableFunctions} syncFunctions - Object containing sync functions for the table.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @returns {Promise<void>} A promise that resolves when the synchronization pull operation is completed.
 * @throws {Error} Throws an error if there is an issue with the synchronization process.
 *
 * @description
 * The `processSyncTypePull` function orchestrates synchronization pull operations for a specific table.
 * It retrieves data from the backend using the provided sync functions and performs the required sync operation
 * (Creates or Updates). The function ensures that the sync process is completed successfully and logs relevant
 * information. If any error occurs during the process, it is thrown.
 *
 * @example
 * // Example usage:
 * const tableName = syncDbTables.statTable;
 * const syncFunctions = { Gets: yourGetFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncTypePull(tableName, syncFunctions, syncOperation);
 */
export const processSyncTypePull = async (
  tableName: syncDbTables,
  syncFunctions: SyncTableFunctions,
  syncOperation: SyncOperation,
): Promise<void> => {
  const lastSynced: string | null = await getLastSyncedForTable(
    tableName,
    SyncType.Pull,
    syncOperation,
  );

  // Get query schema for the table and sync operation
  const tableQuerySchema: QuerySchema = await getQueryObjForTable(
    lastSynced,
    syncOperation,
  );

  // Retrieve data from the backend using the specified sync function
  const response: AxiosResponse<SyncCreateSchemas[]> = await syncFunctions[
    SyncType.Pull
  ](tableQuerySchema);

  // Process synchronization based on the sync operation type
  const rowsToSync = response.data;
  if (rowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Pull}' sync operation '${syncOperation}'.`,
    );
  } else {
    if (syncOperation === SyncOperation.Creates) {
      // Removing any existing rows to avoid errors
      const placeholders = rowsToSync.map(() => '?').join(',');
      const tableUuids = rowsToSync.map(item => ({
        [`${tableName}_id`]: item[`${tableName}_id`],
      }));
      const existingUuids = await runSqlSelect(
        `SELECT * FROM ${tableName} WHERE ${tableName}_id IN (${placeholders})`,
        tableUuids,
      );
      const rowsToInsert = rowsToSync.filter(
        item => !existingUuids.includes(item[`${tableName}_id`]),
      );
      if (rowsToInsert.length > 0) {
        await insertRows(tableName, rowsToInsert);
      }
    } else {
      await updateRows(tableName, rowsToSync);
    }

    // Update the synchronization log
    await insertSyncUpdate({
      table_name: tableName,
      last_synced:
        syncOperation === SyncOperation.Creates
          ? rowsToSync.slice(-1)[0][timestampFields.createdAt]
          : rowsToSync.slice(-1)[0][timestampFields.updatedAt],
      sync_type: SyncType.Pull,
      sync_operation: syncOperation,
    });

    logger.info(
      `Sync type '${SyncType.Pull}' operation '${syncOperation}' completed successfully on table: '${tableName}'`,
    );
  }
};

/**
 * Process synchronization push operation for a specific table.
 *
 * @param {keyof typeof syncDbTables} tableName - The name of the table to synchronize.
 * @param {SyncTableFunctions} tableFunctions - Functions for creating and updating records in the table.
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @throws {Error} If there are issues with retrieving data, sending requests, or updating the sync table.
 *
 * @description
 * The `processSyncTypePush` function synchronizes data push operations for a specific table.
 * It retrieves rows to sync, sends requests to the backend, and updates the sync table accordingly.
 * Throws an error if there are issues with data retrieval, request sending, or sync table updates.
 *
 * @example
 * // Example usage:
 * const tableName = syncDbTables.statTable;
 * const tableFunctions = { Creates: yourCreateFunction, Updates: yourUpdateFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncTypePush(tableName, tableFunctions, syncOperation);
 */
export const processSyncTypePush = async (
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions,
  syncOperation: SyncOperation,
): Promise<void> => {
  try {
    const lastSynced: string | null = await getLastSyncedForTable(
      tableName,
      SyncType.Push,
      syncOperation,
    );

    const rowsToSync: SyncCreateSchemas[] = await getRowsToSync(
      tableName,
      syncOperation,
      lastSynced,
    );

    if (syncOperation === SyncOperation.Creates) {
      processCreatesSyncTypePush(rowsToSync, tableName, tableFunctions);
    } else {
      processUpdatesSyncTypePush(rowsToSync, tableName, tableFunctions);
    }
  } catch (error) {
    logger.error('Error processing synchronization push operation:', error);
    throw error;
  }
};
