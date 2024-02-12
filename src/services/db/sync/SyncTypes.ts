// Typing
import {AxiosResponse} from 'axios';
import {
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
  LastSyncedTimestamps,
} from '@services/db/sync/Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables, timestampFields} from '@shared/Constants';

// Functions
import {
  getLastSyncedForTable,
  getRowsToSyncPush,
  getQueryObjForTable,
  insertSyncUpdate,
  filterRowsForInsertion,
} from '@services/db/sync/SyncUtils';
import {insertRows, updateRows} from '@services/db/Functions';
import {
  processCreatesSyncTypePush,
  processUpdatesSyncTypePush,
} from '@services/db/sync/SyncOperations';

// Logger
import logger from '@utils/Logger';

/**
 * Processes synchronization pull operation for the specified table and Sync operation type.
 *
 * @param {syncDbTables} tableName - The name of the table to synchronize.
 * @param {SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>} syncFunctions - Object containing functions for synchronization operations.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @param {string} syncStart - The timestamp representing the start of the synchronization process.
 * @returns {Promise<void>} A Promise that resolves when the synchronization pull process is completed.
 * @throws {Error} If an error occurs during the synchronization pull process.
 */
export const processSyncTypePull = async (
  tableName: syncDbTables,
  syncFunctions: SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>,
  syncOperation: SyncOperation,
  syncStart: string,
): Promise<void> => {
  const lastSynced: LastSyncedTimestamps = await getLastSyncedForTable(
    tableName,
    SyncType.Pull,
  );

  const tableQuerySchema: QuerySchema = await getQueryObjForTable(
    lastSynced.created_at,
    lastSynced.updated_at,
    syncOperation,
    syncStart,
  );

  // Retrieve data from the backend using the specified sync function
  const response: AxiosResponse<SyncCreateSchemas[]> = await syncFunctions[
    SyncType.Pull
  ](tableQuerySchema);

  // Process synchronization based on the Sync operation type
  const rowsToSync = response.data || [];

  if (response.status === 201 && rowsToSync.length > 0) {
    if (syncOperation === SyncOperation.Creates) {
      // Removing any existing rows to avoid errors
      const rowsToInsert = await filterRowsForInsertion(tableName, rowsToSync);
      if (rowsToInsert.length > 0) {
        await insertRows(tableName, rowsToInsert);
      }
    } else {
      await updateRows(tableName, rowsToSync);
    }

    // Update the synchronization log
    await insertSyncUpdate({
      table_name: tableName,
      // IMPORTANT:
      // This 'last_synced' must the timestamp of the last sync'd
      // row as this allows us to sync in batches. See 'syncBatchLimit'.
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
  } else if (response.status !== 201) {
    logger.error(
      `Sync type '${SyncType.Pull}' Sync operation '${syncOperation}' has failed due to unexpected response status code: '${response.status}'`,
    );
  } else {
    logger.info(
      `Sync type '${SyncType.Pull}' Sync operation '${syncOperation}' has received no rows to sync.`,
    );
  }
};

/**
 * Processes synchronization push operation for the specified table and Sync operation type.
 *
 * @param {syncDbTables} tableName - The name of the table to synchronize.
 * @param {SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>} syncFunctions - Object containing functions for synchronization operations.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @param {string} syncStart - The timestamp representing the start of the synchronization process.
 * @returns {Promise<void>} A Promise that resolves when the synchronization push process is completed.
 * @throws {Error} If an error occurs during the synchronization push process.
 */

export const processSyncTypePush = async (
  tableName: syncDbTables,
  syncFunctions: SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>,
  syncOperation: SyncOperation,
  syncStart: string,
): Promise<void> => {
  try {
    const lastSynced: LastSyncedTimestamps | null = await getLastSyncedForTable(
      tableName,
      SyncType.Push,
    );

    const rowsToSync: SyncCreateSchemas[] = await getRowsToSyncPush(
      tableName,
      syncOperation,
      lastSynced.created_at,
      lastSynced.updated_at,
      syncStart,
    );

    if (syncOperation === SyncOperation.Creates) {
      processCreatesSyncTypePush(rowsToSync, tableName, syncFunctions);
    } else {
      processUpdatesSyncTypePush(rowsToSync, tableName, syncFunctions);
    }
  } catch (error) {
    logger.error('Error processing synchronization push operation:', error);
    throw error;
  }
};
