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
import {StatSchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@shared/enums';
import {dbTables} from '@shared/contants';

// Functions
import {db} from '../functions';
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
  tableName: string,
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
          console.log(error);
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
  tableName: string,
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
            ),
          );
        },
        (error: Transaction) => {
          logger.info(error);
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
export const insertSyncUpdate = (syncUpdate: SyncTable): Promise<void> => {
  const columns = `(${Object.keys(syncUpdate)
    .map(key => `'${key}'`)
    .join(', ')})`;
  const insertValues = `(${Object.keys(syncUpdate)
    .map(() => '?')
    .join(', ')})`;

  return new Promise(() => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO ${dbTables.syncTable} ${columns} VALUES ${insertValues};`,
        Object.values(syncUpdate),
        () => {
          logger.info('Sync Table Insert successful');
        },
        (error: Transaction) => {
          console.error(error);
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
  tableName: keyof typeof dbTables,
  tableFunctions: SyncTableFunctions,
  syncType: SyncType,
  syncOperation: SyncOperation,
): Promise<void> => {
  try {
    const lastSynced: string = await getLastSyncedForTable(
      tableName,
      syncType,
      syncOperation,
    );

    const rowsToSync: (SyncCreateSchemas | SyncUpdateSchemas)[] =
      await getRowsToSync(tableName, syncOperation, lastSynced);

    if (rowsToSync.length === 0) {
      logger.info(
        `No rows to sync for table '${tableName}' sync type '${syncType}' sync operation '${syncOperation}'.`,
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
              last_synced: lastRow.created_at,
              sync_type: syncType,
              sync_operation: syncOperation,
            });
          } else {
            console.error('Unexpected response status code: ', response.status);
          }
        } catch (error) {
          console.error('Error sending request:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error processing synchronization push operation:', error);
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
      await processSyncPushOperation(
        tableName as keyof typeof dbTables,
        tableFunctions,
        SyncType.Push,
        SyncOperation.Creates,
      );
      await processSyncPushOperation(
        tableName as keyof typeof dbTables,
        tableFunctions,
        SyncType.Push,
        SyncOperation.Updates,
      );
    }
  } catch (error) {
    console.error('Error processing synchronization push:', error);
    throw error;
  }
};
