import {AxiosResponse} from 'axios';
import {SyncOperation, SyncType} from 'src/shared/enums';
import {dbTables} from 'src/shared/contants';
import {StatSchema} from '../../api/swagger/data-contracts';

/**
 * Represents a schema for data that can be synchronized during a create operation.
 *
 * @class SyncCreateSchemas
 *
 * @description A schema for data that can be synchronized during a create operation.
 */
export type SyncCreateSchemas = StatSchema;

/**
 * Represents a schema for data that can be synchronized during an update operation.
 *
 * @class SyncUpdateSchemas
 *
 * @description A schema for data that can be synchronized during an update operation.
 */
export type SyncUpdateSchemas = StatSchema;

/**
 * Defines functions for creating and updating records in a synchronized table.
 *
 * @interface SyncTableFunctions
 *
 * @property {function(data: SyncCreateSchemas): Promise<AxiosResponse>} Creates - Function for creating records.
 * @property {function(data: SyncUpdateSchemas): Promise<AxiosResponse>} Updates - Function for updating records.
 */
export interface SyncTableFunctions {
  [SyncOperation.Creates]: (data: SyncCreateSchemas) => Promise<AxiosResponse>;
  [SyncOperation.Updates]: (data: SyncUpdateSchemas) => Promise<AxiosResponse>;
}

/**
 * Defines the API functions for synchronization for a specific table.
 *
 * @interface SyncApiFunctions
 *
 * @property {SyncTableFunctions} statTable - API functions for the 'statTable' table.
 */
export interface SyncApiFunctions {
  [dbTables.statTable]: SyncTableFunctions;
}

/**
 * Represents a record in the synchronization table, tracking synchronization status for a specific table.
 *
 * @interface SyncTable
 *
 * @property {string} table_name - The name of the table being synchronized.
 * @property {string} last_synced - The timestamp of the last successful synchronization for the table.
 * @property {SyncType} sync_type - The type of synchronization (e.g., Push, Pull).
 * @property {SyncOperation} sync_operation - The synchronization operation (e.g., Creates, Updates).
 */
export interface SyncTable {
  table_name: string;
  last_synced: string;
  sync_type: SyncType;
  sync_operation: SyncOperation;
}
