import {AxiosResponse} from 'axios';

export const syncTable: string = 'sync_table';

export const syncBatchLimit: number = 100;

export interface ApiFunctions {
  [key: string]: (data: any) => Promise<AxiosResponse>;
}

export interface SyncTable {
  table_name: string;
  last_synced: number;
  sync_type: 'push' | 'pull';
}
