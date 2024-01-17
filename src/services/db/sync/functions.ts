// Typing
import {AxiosResponse} from 'axios';
import {Transaction, ResultSet} from 'react-native-sqlite-storage';
import {
  SyncApiFunctions,
  SyncTable,
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
} from './types';
import {StatSchema, QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@shared/enums';
import {dbTables, timestampFields} from '@shared/contants';

// Functions
import {db, updateRows, insertRows} from '../functions';
import api from '@services/api/apiService';
import {Stat} from '@services/api/swagger/Stat';
import {getLastSyncedForTableQuery, getRowsToSyncQuery} from './queries';

// Logger
import logger from '@utils/logger';

const StatApi = new Stat(api);

const apiFunctions: SyncApiFunctions = {
  [dbTables.statTable]: {
    [SyncOperation.Creates]: (data: StatSchema): Promise<AxiosResponse> =>
      StatApi.createCreate(data),
    [SyncOperation.Updates]: (data: StatSchema): Promise<AxiosResponse> =>
      StatApi.updateUpdate(data),
    [SyncOperation.Gets]: (data: QuerySchema): Promise<AxiosResponse> =>
      StatApi.postStat(data),
  },
};

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
  tableName: dbTables,
  syncType: SyncType,
  syncOperation: SyncOperation,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        getLastSyncedForTableQuery(tableName, syncType, syncOperation),
        [],
        (_, result: ResultSet) => {
          resolve(result.rows.item(0)?.last_synced);
        },
        (error: Transaction) => {
          reject(error);
        },
      );
    });
  });
};

/**
 * Retrieve rows to be synchronized for a specific table and sync operation.
 *
 * @param {string} tableName - The name of the table to retrieve rows for synchronization.
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @param {string | undefined} lastSyncTime - Optional timestamp to filter rows updated since the last sync.
 * @returns {Promise<(SyncCreateSchemas | SyncUpdateSchemas)[]>} A promise that resolves to an array
 *   of schemas representing rows to be synchronized.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const getRowsToSync = async (
  tableName: dbTables,
  syncOperation: SyncOperation,
  lastSyncTime?: string,
): Promise<(SyncCreateSchemas | SyncUpdateSchemas)[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        getRowsToSyncQuery(tableName, syncOperation, lastSyncTime),
        [],
        (_, result: ResultSet) => {
          resolve(
            Array.from({length: result.rows.length}, (_, i) =>
              result.rows.item(i),
            ) || [],
          );
        },
        (error: Transaction) => {
          reject(error);
        },
      );
    });
  });
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

  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO ${dbTables.syncTable} ${columns} VALUES ${insertValues};`,
        Object.values(syncUpdate),
        (_, resultSet: ResultSet) => {
          // Check if the operation was successful (you might need to adjust this condition based on your logic)
          if (resultSet.rowsAffected > 0) {
            resolve(); // Resolve the Promise on success
          }
        },
        (error: Transaction) => {
          reject(error);
        },
      );
    });
  });
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
 * The `processSyncPushOperation` function synchronizes data push operations for a specific table.
 * It retrieves rows to sync, sends requests to the backend, and updates the sync table accordingly.
 * Throws an error if there are issues with data retrieval, request sending, or sync table updates.
 *
 * @example
 * // Example usage:
 * const tableName = dbTables.statTable;
 * const tableFunctions = { Creates: yourCreateFunction, Updates: yourUpdateFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncPushOperation(tableName, tableFunctions, syncOperation);
 */
export const processSyncPushOperation = async (
  tableName: dbTables,
  tableFunctions: SyncTableFunctions,
  syncOperation: SyncOperation,
): Promise<void> => {
  try {
    const lastSynced: string = await getLastSyncedForTable(
      tableName,
      SyncType.Push,
      syncOperation,
    );

    const rowsToSync: (SyncCreateSchemas | SyncUpdateSchemas)[] =
      await getRowsToSync(tableName, syncOperation, lastSynced);

    if (rowsToSync.length === 0) {
      logger.info(
        `No rows to sync for table '${tableName}' sync type '${SyncType.Push}' sync operation '${syncOperation}'.`,
      );
    } else {
      // Get the last row in this ascending ordered batch
      const lastRow: SyncCreateSchemas | SyncUpdateSchemas =
        rowsToSync.slice(-1)[0];

      // Pushing a single row at a time to the backend
      for (const row of rowsToSync) {
        try {
          const response: AxiosResponse<void> = await tableFunctions[
            syncOperation
          ](row);

          if (response.status === 204) {
            await insertSyncUpdate({
              table_name: tableName,
              last_synced:
                syncOperation == SyncOperation.Creates
                  ? lastRow[timestampFields.createdAt]
                  : lastRow[timestampFields.updatedAt],
              sync_type: SyncType.Push,
              sync_operation: syncOperation,
            });
          } else {
            logger.error('Unexpected response status code: ', response.status);
          }
        } catch (error) {
          logger.error('Error sending request:', error);
        }
      }
      logger.info(
        `Successfully processed synchronization ${SyncType.Push} for '${syncOperation}' on table: '${tableName}'`,
      );
    }
  } catch (error) {
    logger.error('Error processing synchronization push operation:', error);
    throw error;
  }
};

/**
 * Process synchronization push for all tables.
 *
 * Iterates through the tables defined in the `apiFunctions` object and performs synchronization
 * push operations for both create and update operations.
 *
 * @throws {Error} If there are issues with processing synchronization push operations for any table.
 *
 * @description
 * The `processSyncPush` function iterates through tables in the `apiFunctions` object
 * and triggers synchronization push operations for both create and update operations.
 * It logs information about the progress and completion of the synchronization process.
 * Throws an error if there are issues with any synchronization push operation.
 *
 * @example
 * // Example usage:
 * await processSyncPush();
 */
export const processSyncPush = async (): Promise<void> => {
  try {
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing synchronization ${SyncType.Push} for table: '${tableName}'`,
      );

      // Trigger synchronization push for create operation
      await processSyncPushOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

      // Trigger synchronization push for update operation
      await processSyncPushOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Updates,
      );
    }

    logger.info(
      `Synchronization ${SyncType.Push} completed successfully for all tables.`,
    );
  } catch (error) {
    logger.error(`Error processing synchronization ${SyncType.Push}:`, error);
    throw error;
  }
};

/**
 * Generate a query object for synchronizing a table based on the last synchronization time.
 *
 * @param {dbTables} tableName - The name of the table for which to generate the query.
 * @param {SyncOperation} syncType - The type of synchronization operation (Creates or Updates).
 * @returns {Promise<QuerySchema>} A promise that resolves with the generated query schema.
 * @throws {Error} Throws an error if there is an issue fetching the last synchronization time.
 *
 * @description
 * The `getQueryObjForTable` function generates a query schema for synchronizing a table based on the last synchronization time.
 * It retrieves the last synced timestamp and constructs a query schema with filters and sorting based on the sync type.
 * The generated query schema is returned as a promise.
 *
 * @example
 * // Example usage:
 * const tableName = dbTables.statTable;
 * const syncType = SyncOperation.Creates;
 * const queryObj = await getQueryObjForTable(tableName, syncType);
 */
const getQueryObjForTable = async (
  tableName: dbTables,
  syncType: SyncOperation,
): Promise<QuerySchema> => {
  // Get the last synced timestamp for the table
  const lastSynced: string = await getLastSyncedForTable(
    tableName,
    SyncType.Pull,
    syncType,
  );

  // Determine the timestamp field based on the sync type
  const timestampField =
    syncType === SyncOperation.Creates
      ? timestampFields.createdAt
      : timestampFields.updatedAt;

  // Define the condition for the timestamp field
  const condition = lastSynced === undefined ? {ne: null} : {gt: lastSynced};

  // Construct and return the query schema
  return {
    filters: {
      [timestampField]: condition,
    },
    sort: [`${timestampField}:asc`],
  } as QuerySchema;
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
 * The `processSyncPullOperation` function orchestrates synchronization pull operations for a specific table.
 * It retrieves data from the backend using the provided sync functions and performs the required sync operation
 * (Creates or Updates). The function ensures that the sync process is completed successfully and logs relevant
 * information. If any error occurs during the process, it is thrown.
 *
 * @example
 * // Example usage:
 * const tableName = dbTables.statTable;
 * const syncFunctions = { Gets: yourGetFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncPullOperation(tableName, syncFunctions, syncOperation);
 */
const processSyncPullOperation = async (
  tableName: dbTables,
  syncFunctions: SyncTableFunctions,
  syncOperation: SyncOperation,
): Promise<void> => {
  // Get query schema for the table and sync operation
  const tableQuerySchema: QuerySchema = await getQueryObjForTable(
    tableName,
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
      `Successfully processed synchronization ${SyncType.Pull} for '${syncOperation}' on table: '${tableName}'`,
    );
  }
};

/**
 * Process synchronization pull for all tables.
 *
 * This function iterates through the tables defined in the `apiFunctions` object and performs
 * synchronization pull operations for both create and update operations.
 *
 * @returns {Promise<void>} A promise that resolves when synchronization pull is completed successfully for all tables.
 * @throws {Error} Throws an error if there are issues with processing synchronization pull operations for any table.
 *
 * @description
 * The `processSyncPull` function orchestrates synchronization pull operations for all tables. It sequentially
 * processes create and update operations for each table, ensuring that synchronization is completed successfully.
 * If any error occurs during the process, it is logged, and the function throws an error.
 */
export const processSyncPull = async (): Promise<void> => {
  try {
    // Iterate through each table in apiFunctions
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing synchronization ${SyncType.Pull} for table: '${tableName}'`,
      );

      // Process synchronization pull for create operations
      await processSyncPullOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

      // Process synchronization pull for update operations
      await processSyncPullOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Updates,
      );
    }

    logger.info(
      `Synchronization ${SyncType.Pull} completed successfully for all tables.`,
    );
  } catch (error) {
    logger.error(`Error processing synchronization ${SyncType.Pull}:`, error);
    throw error;
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
 * The `processSyncPullPush` function orchestrates synchronization pull and push operations for all tables. It sequentially
 * processes pull and push operations for each table, ensuring that synchronization is completed successfully.
 * If any error occurs during the process, it is logged, and the function throws an error.
 */
export const processSyncPullPush = async (): Promise<void> => {
  try {
    // Iterate through each table in apiFunctions
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing synchronization ${SyncType.Pull} for table: '${tableName}'`,
      );

      // Process synchronization pull for create operations
      await processSyncPullOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

      // Process synchronization pull for update operations
      await processSyncPullOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Updates,
      );

      // Log information about the completion of synchronization pull
      logger.info(
        `Synchronization ${SyncType.Pull} completed successfully for table: '${tableName}'.`,
      );

      logger.info(
        `Processing synchronization ${SyncType.Push} for table: '${tableName}'`,
      );

      // Trigger synchronization push for create operation
      await processSyncPushOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

      // Trigger synchronization push for update operation
      await processSyncPushOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Updates,
      );

      // Log information about the completion of synchronization push
      logger.info(
        `Synchronization ${SyncType.Push} completed successfully for table: '${tableName}'.`,
      );
    }

    logger.info(
      'Synchronization pull and push completed successfully for all tables.',
    );
  } catch (error) {
    logger.error('Error processing synchronization:', error);
    throw error;
  }
};
