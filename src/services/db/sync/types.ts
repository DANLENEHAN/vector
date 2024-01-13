import {AxiosResponse} from 'axios';
import {SyncOperation, SyncType} from 'src/shared/enums';
import {dbTables} from 'src/shared/contants';
import {StatSchema} from '../../api/swagger/data-contracts';

// Acceptable Schemas
export type SyncCreateSchemas = StatSchema;
export type SyncUpdateSchemas = StatSchema;

export interface SyncTableFunctions {
  [SyncOperation.Creates]: (data: SyncCreateSchemas) => Promise<AxiosResponse>;
  [SyncOperation.Updates]: (data: SyncUpdateSchemas) => Promise<AxiosResponse>;
}

export interface SyncApiFunctions {
  [dbTables.statTable]: SyncTableFunctions;
}

export interface SyncTable {
  table_name: string;
  last_synced: string;
  sync_type: SyncType;
  sync_operation: SyncOperation;
}
