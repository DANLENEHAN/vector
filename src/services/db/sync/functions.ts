import {AxiosResponse} from 'axios';

import {Transaction, ResultSet} from 'react-native-sqlite-storage';

import {ApiFunctions, SyncTable, syncTable} from './types';
import {statTable} from '../stat/types';

import api from '../../api/apiService';
import {Stat} from '../../api/swagger/Stat';
import {StatSchema} from '../../api/swagger/data-contracts';
import {db} from '../functions';
import {getSyncInfoForTableQuery, getRowsToSyncQuery} from './queries';
import {RowData} from '../types';

const StatApi = new Stat(api);

const apiFunctions: ApiFunctions = {
  [statTable]: (data: StatSchema): Promise<AxiosResponse> =>
    StatApi.createCreate(data),
};

export const getSyncInfoForTable = async (
  tableName: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        getSyncInfoForTableQuery(tableName),
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

export const getRowsToSync = async (
  tableName: string,
  lastSyncTime?: string,
): Promise<RowData[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        getRowsToSyncQuery(tableName, lastSyncTime),
        [],
        (_, result: ResultSet) => {
          resolve(
            Array.from({length: result.rows.length}, (_, i) =>
              result.rows.item(i),
            ),
          );
        },
        (error: Transaction) => {
          console.log(error);
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
        `INSERT OR REPLACE INTO ${syncTable} ${columns} VALUES ${insertValues};`,
        Object.values(syncUpdate),
        () => {
          console.log('Sync Table Insert successful');
        },
        (error: Transaction) => {
          console.error(error);
        },
      );
    });
  });
};

export const syncPush = async () => {
  for (const [tableName, createFunction] of Object.entries(apiFunctions)) {
    const last_synced: string = await getSyncInfoForTable(tableName);

    const rowsToSync: RowData[] = await getRowsToSync(tableName, last_synced);

    if (rowsToSync.length === 0) {
      console.log(`No rows to sync for table ${tableName} continuing...`);
    } else {
      const lastRow: RowData = rowsToSync.slice(-1)[0];

      for (const row of rowsToSync) {
        try {
          const response: AxiosResponse<void> = await createFunction(row);

          if (response.status === 204) {
            console.log('Creating sync table entery');
            insertSyncUpdate({
              table_name: tableName,
              last_synced: lastRow.created_at,
              sync_type: 'push',
            });
          } else {
            console.error('Unexpected response status code: ', response.status);
          }
        } catch (error) {
          console.error('Error sending request:', error);
        }
      }
    }
  }
};
