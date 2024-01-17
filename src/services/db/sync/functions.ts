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
 * @param {SyncType} syncType - The type of synchronization (e.g., Push).
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @throws {Error} If there are issues with retrieving data, sending requests, or updating the sync table.
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

          if (response.status === 201) {
            await insertSyncUpdate({
              table_name: tableName,
              last_synced:
                syncOperation == SyncOperation.Creates
                  ? lastRow[timestampFields.createdAt]
                  : lastRow[timestampFields.createdAt],
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
 */
export const processSyncPush = async (): Promise<void> => {
  try {
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing synchronization ${SyncType.Push} for table: '${tableName}'`,
      );
      await processSyncPushOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

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
 * @param {string} tableName - The name of the table for which to generate the query.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @returns {Promise<QuerySchema>} A promise that resolves with the generated query schema.
 *
 * @throws {Error} Throws an error if there is an issue fetching the last synchronization time.
 *
 * @example
 * // Example usage:
 * const tableName = 'statTable';
 * const syncOperation = SyncOperation.Creates;
 * const queryObj = await getQueryObjForTable(tableName, syncOperation);
 */
const getQueryObjForTable = async (
  tableName: dbTables,
  syncOperation: SyncOperation,
): Promise<QuerySchema> => {
  const lastSynced: string = await getLastSyncedForTable(
    tableName,
    SyncType.Pull,
    syncOperation,
  );

  const timstampField = `${
    syncOperation === 'creates'
      ? timestampFields.createdAt
      : timestampFields.updatedAt
  }`;
  const condition = lastSynced === undefined ? {ne: null} : {gt: lastSynced};

  return {
    filters: {
      [timstampField]: condition,
    },
    sort: [`${timstampField}:asc`],
  } as QuerySchema;
};

/**
 * Process a synchronization pull operation for a specific table.
 *
 * @param {keyof typeof dbTables} tableName - The name of the table to sync.
 * @param {SyncTableFunctions} tableFunctions - Object containing sync functions for the table.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @returns {Promise<void>} A promise that resolves when the synchronization pull operation is completed.
 *
 * @throws {Error} Throws an error if there is an issue with the synchronization process.
 *
 * @example
 * // Example usage:
 * const tableName = 'statTable';
 * const tableFunctions = { Gets: yourGetFunction };
 * const syncOperation = SyncOperation.Creates;
 * await processSyncPullOperation(tableName, tableFunctions, syncOperation);
 */
const processSyncPullOperation = async (
  tableName: dbTables,
  tableFunctions: SyncTableFunctions,
  syncOperation: SyncOperation,
): Promise<void> => {
  const tableQuerySchema: QuerySchema = await getQueryObjForTable(
    tableName,
    syncOperation,
  );

  const response: AxiosResponse<SyncCreateSchemas[]> = await tableFunctions[
    SyncOperation.Gets
  ](tableQuerySchema);

  const rowsToSync = response.data;
  if (rowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Pull}' sync operation '${syncOperation}'.`,
    );
  } else {
    if (syncOperation == SyncOperation.Creates) {
      await insertRows(tableName, rowsToSync);
    } else {
      await updateRows(tableName, rowsToSync);
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced:
        syncOperation == SyncOperation.Creates
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
 * Iterates through the tables defined in the `apiFunctions` object and performs synchronization
 * pull operations for both create and update operations.
 *
 * @throws {Error} If there are issues with processing synchronization pull operations for any table.
 */
export const processSyncPull = async (): Promise<void> => {
  try {
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing synchronization ${SyncType.Pull} for table: '${tableName}'`,
      );
      await processSyncPullOperation(
        tableName as dbTables,
        tableFunctions,
        SyncOperation.Creates,
      );

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
