import {AxiosResponse} from 'axios';
import {Transaction, ResultSet} from 'react-native-sqlite-storage';

import {
  SyncApiFunctions,
  SyncTable,
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
} from './types';
import {SyncOperation, SyncType} from '@shared/enums';
import {dbTables} from '@shared/contants';
import {db} from '../functions';

import api from '@services/api/apiService';
import {Stat} from '@services/api/swagger/Stat';
import {StatSchema} from '@services/api/swagger/data-contracts';
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

export const processSyncPushOperation = async (
  tableName: keyof typeof dbTables,
  tableFunctions: SyncTableFunctions,
  syncType: SyncType,
  syncOperation: SyncOperation,
) => {
  const last_synced: string = await getLastSyncedForTable(
    tableName,
    syncType,
    syncOperation,
  );
  const rowsToSync: (SyncCreateSchemas | SyncUpdateSchemas)[] =
    await getRowsToSync(tableName, syncOperation, last_synced);

  if (rowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName} sync type '${syncType}' sync operation '${syncOperation}'.`,
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
          insertSyncUpdate({
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
};

export const processSyncPush = async () => {
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
};
