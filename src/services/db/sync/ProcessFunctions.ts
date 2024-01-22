// Typing
import {AxiosResponse} from 'axios';
import {
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
} from './types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@shared/enums';
import {dbTables, timestampFields} from '@shared/Constants';

// Functions
import {updateRows, insertRows} from '@services/db/functions';
import {
  convertListToSyncUpdateSchemas,
  insertSyncUpdate,
  getLastSyncedForTable,
  getRowsToSync,
  getQueryObjForTable,
} from '@services/db/sync/utils';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';

// Logger
import logger from '@utils/logger';

export const processUpdatesSyncTypePush = async (
  rows: SyncCreateSchemas[],
  tableName: dbTables,
  tableFunctions: SyncTableFunctions,
) => {
  let successfulRequests = 0;

  if (rows.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Push}' sync operation '${SyncOperation.Updates}'.`,
    );
  } else {
    const rowsToSync = convertListToSyncUpdateSchemas(rows);
    const lastRow: SyncCreateSchemas | SyncUpdateSchemas =
      rowsToSync.slice(-1)[0];

    for (const row of rowsToSync) {
      try {
        const response: AxiosResponse<void> = await tableFunctions[
          SyncOperation.Updates
        ](row, {isSync: true});

        if (response.status === 204) {
          successfulRequests++;
        } else {
          logger.error('Unexpected response status code: ', response.status);
        }
      } catch (error) {
        logger.error('Error sending request:', error);
      }
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced: lastRow[timestampFields.updatedAt],
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${SyncOperation.Updates}' completed successfully on table: '${tableName}'. ${successfulRequests}/${rows.length} succeeded.`,
  );
};

const processCreatesSyncTypePush = async (
  rowsToSync: SyncCreateSchemas[],
  tableName: dbTables,
  tableFunctions: SyncTableFunctions,
) => {
  let successfulRequests = 0;

  if (rowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Push}' sync operation '${SyncOperation.Creates}'.`,
    );
  } else {
    const lastRow: SyncCreateSchemas | SyncUpdateSchemas =
      rowsToSync.slice(-1)[0];

    for (const row of rowsToSync) {
      try {
        const response: AxiosResponse<void> = await tableFunctions[
          SyncOperation.Creates
        ](row, {isSync: true});

        if (response.status === 201) {
          successfulRequests++;
        } else {
          logger.error('Unexpected response status code: ', response.status);
        }
      } catch (error) {
        logger.error('Error sending request:', error);
      }
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced: lastRow[timestampFields.createdAt],
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${SyncOperation.Creates}' completed successfully on table: '${tableName}'. ${successfulRequests}/${rowsToSync.length} succeeded.`,
  );
};

/**
 * Process synchronization push operation for a specific table.
 *
 * @param {keyof typeof dbTables} tableName - The name of the table to synchronize.
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
 * const tableName = dbTables.statTable;
 * const tableFunctions = { Creates: yourCreateFunction, Updates: yourUpdateFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncTypePush(tableName, tableFunctions, syncOperation);
 */
export const processSyncTypePush = async (
  tableName: dbTables,
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

/**
 * Process a synchronization pull operation for a specific table.
 *
 * @param {dbTables} tableName - The name of the table to sync.
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
 * const tableName = dbTables.statTable;
 * const syncFunctions = { Gets: yourGetFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncTypePull(tableName, syncFunctions, syncOperation);
 */
export const processSyncTypePull = async (
  tableName: dbTables,
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
    SyncOperation.Gets
  ](tableQuerySchema);

  // Process synchronization based on the sync operation type
  const rowsToSync = response.data;
  if (rowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Pull}' sync operation '${syncOperation}'.`,
    );
  } else {
    if (syncOperation === SyncOperation.Creates) {
      await insertRows(tableName, rowsToSync, false);
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
 * Process synchronization pull and push for all tables.
 *
 * This function iterates through the tables defined in the `apiFunctions` object and performs
 * synchronization pull and push operations for both create and update operations.
 *
 * @returns {Promise<void>} A promise that resolves when synchronization pull and push are completed successfully for all tables.
 * @throws {Error} Throws an error if there are issues with processing synchronization operations for any table.
 *
 * @description
 * The `runSynchronisation` function orchestrates synchronization pull and push operations for all tables. It sequentially
 * processes pull and push operations for each table, ensuring that synchronization is completed successfully.
 * If any error occurs during the process, it is logged, and the function throws an error.
 */
export const runSynchronisation = async (): Promise<void> => {
  try {
    // Iterate through each table in apiFunctions
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing sync type '${SyncType.Pull}' for table: '${tableName}'`,
      );

      // Process synchronization pull for create operations
      await processSyncTypePull(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

      // Process synchronization pull for update operations
      await processSyncTypePull(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Updates,
      );

      // Log information about the completion of synchronization pull
      logger.info(
        `Sync '${SyncType.Pull}' completed successfully for table: '${tableName}'.`,
      );

      logger.info(
        `Processing sync type '${SyncType.Push}' for table: '${tableName}'`,
      );

      // Trigger synchronization push for create operation
      await processSyncTypePush(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

      // Trigger synchronization push for update operation
      await processSyncTypePush(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Updates,
      );

      logger.info(
        `Sync type ${SyncType.Push} completed successfully for table: '${tableName}'.`,
      );
    }

    logger.info(
      `Sync types '${SyncType.Pull}' and '${SyncType.Push}' completed successfully for all tables.`,
    );
  } catch (error) {
    logger.error('Error processing synchronization:', error);
    throw error;
  }
};
