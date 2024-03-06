// Typing
import axios from 'axios';
import {
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
  LastSyncedTimestamps,
  GetsFunction,
} from '@services/db/sync/Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables, timestampFields, unixEpoch} from '@shared/Constants';

// Functions
import {
  getLastSyncedForTable,
  getRowsToSyncPush,
  getQueryObjForTable,
  insertSyncUpdate,
  filterRowsForInsertion,
} from '@services/db/sync/Functions';
import {insertRows, updateRows} from '@services/db/Operations';
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
  getFunction: GetsFunction,
  syncOperation: SyncOperation,
  syncStart: string,
): Promise<void> => {
  const lastSynced: LastSyncedTimestamps = await getLastSyncedForTable(
    tableName,
    SyncType.Pull,
  );

  // Get time when the Sync Type Push Operation 'syncOperation' happened for
  // this table
  const lastSyncedPush: LastSyncedTimestamps = await getLastSyncedForTable(
    tableName,
    SyncType.Push,
  );
  const lastSyncedPushOperation =
    lastSyncedPush[
      syncOperation === SyncOperation.Creates
        ? timestampFields.createdAt
        : timestampFields.updatedAt
    ];

  const tableQuerySchema: QuerySchema = getQueryObjForTable(
    lastSynced.created_at,
    lastSynced.updated_at,
    syncOperation,
    syncStart,
  );

  // Default the lastSyncedTimestamp to the syncStart.
  // In the event there are no rows to sync this will be used.
  let lastSyncedTimestamp = syncStart;

  try {
    const response = await getFunction(tableQuerySchema);
    // Process synchronization based on the Sync operation type
    const rowsToSync = response.data;

    if (response.status === 201 && rowsToSync.length > 0) {
      if (syncOperation === SyncOperation.Creates) {
        // Removing any existing rows to avoid errors
        const rowsToInsert = await filterRowsForInsertion(
          tableName,
          rowsToSync,
        );
        if (rowsToInsert.length > 0) {
          await insertRows<SyncCreateSchemas>(tableName, rowsToInsert);
          lastSyncedTimestamp =
            rowsToInsert.slice(-1)[0][timestampFields.createdAt];
        }
      } else {
        if (rowsToSync.length > 0) {
          await updateRows<SyncCreateSchemas>(tableName, rowsToSync);
          lastSyncedTimestamp =
            rowsToSync.slice(-1)[0][timestampFields.updatedAt]!;
        }
      }
      logger.info(
        `(Synctype)=(${SyncType.Pull}); (SyncOperation)=(${syncOperation}); (tableName)=(${tableName}) - Sync Complete`,
      );
    } else if (response.status !== 201) {
      logger.error(
        `(Synctype)=(${SyncType.Pull}); (SyncOperation)=(${syncOperation}); (tableName)=(${tableName}) - failed with status code (${response.status})`,
      );
    } else {
      logger.info(
        `(Synctype)=(${SyncType.Pull}); (SyncOperation)=(${syncOperation}); (tableName)=(${tableName}) - has no rows to Sync`,
      );
    }

    // Update the synchronization log
    await insertSyncUpdate({
      table_name: tableName,
      // IMPORTANT:
      // If there are rows to be sync. The 'last_synced'
      // must the timestamp of the last sync'd row as
      // this allows us to sync in batches. See 'syncBatchLimit'.
      last_synced: lastSyncedTimestamp,
      sync_type: SyncType.Pull,
      sync_operation: syncOperation,
    });
    // We Sync Pull always before Push
    // After the first ever Pull for a table we will look to push
    // The Last Push will not exist so we'll try push everything we've got
    // Adding a last push here to equate to the first pull means we'll prevent
    // this scenairo from happening
    if (lastSyncedPushOperation === unixEpoch) {
      await insertSyncUpdate({
        table_name: tableName,
        last_synced: lastSyncedTimestamp,
        sync_type: SyncType.Push,
        sync_operation: syncOperation,
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(
        `(Synctype)=(${SyncType.Pull}); (SyncOperation)=(${syncOperation}); (tableName)=(${tableName}) - failed with error (${error.message})`,
      );
    }
    return Promise.resolve();
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
    const lastSynced: LastSyncedTimestamps = await getLastSyncedForTable(
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
      await processCreatesSyncTypePush(
        rowsToSync,
        tableName,
        syncFunctions,
        syncStart,
      );
    } else {
      await processUpdatesSyncTypePush(
        rowsToSync,
        tableName,
        syncFunctions,
        syncStart,
      );
    }
  } catch (error) {
    logger.error(
      `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${syncOperation}); (tableName)=(${tableName}) - Sync failed with error (${error})`,
    );
    throw error;
  }
};
