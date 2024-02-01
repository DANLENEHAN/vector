import {AxiosResponse} from 'axios';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {
  StatCreateSchema,
  StatUpdateSchema,
  MoodUpdateSchema,
  MoodCreateSchema,
  MoodTagCreateSchema,
  MoodTagUpdateSchema,
  MoodTagLinkCreateSchema,
  MoodTagLinkUpdateSchema,
  NutritionCreateSchema,
  NutritionUpdateSchema,
  QuerySchema,
} from '@services/api/swagger/data-contracts';

/**
 * Represents a schema for data that can be synchronized during a create operation.
 *
 * @class SyncCreateSchemas
 *
 * @description A schema for data that can be synchronized during a create operation.
 */
export type SyncCreateSchemas =
  | StatCreateSchema
  | MoodCreateSchema
  | MoodTagCreateSchema
  | MoodTagLinkCreateSchema
  | NutritionCreateSchema;

/**
 * Represents a schema for data that can be synchronized during an update operation.
 *
 * @class SyncUpdateSchemas
 *
 * @description A schema for data that can be synchronized during an update operation.
 */
export type SyncUpdateSchemas =
  | StatUpdateSchema
  | MoodUpdateSchema
  | MoodTagUpdateSchema
  | MoodTagLinkUpdateSchema
  | NutritionUpdateSchema;

/**
 * Represents an object with synchronization information.
 *
 * @interface SyncObject
 *
 * @property {boolean} isSync - A flag indicating whether the object is synchronized.
 *
 * @example
 * // Example usage:
 * const syncData: SyncObject = {
 *   isSync: true,
 * };
 */
export interface SyncObject {
  isSync: boolean;
}

/**
 * Function signature for creating records in a synchronized table.
 *
 * @type {function(data: SyncCreateSchemas): Promise<AxiosResponse>} CreatesFunction
 */
export type CreatesFunction<T extends SyncCreateSchemas> = (
  data: T,
  query?: SyncObject,
) => Promise<AxiosResponse>;

/**
 * Function signature for updating records in a synchronized table.
 *
 * @type {function(data: SyncUpdateSchemas): Promise<AxiosResponse>} UpdatesFunction
 */
export type UpdatesFunction<T extends SyncUpdateSchemas> = (
  data: T,
  query?: SyncObject,
) => Promise<AxiosResponse>;

/**
 * Function signature for retrieving records from a synchronized table.
 *
 * @type {function(data: QuerySchema): Promise<AxiosResponse<SyncCreateSchemas[]>>} GetsFunction
 */
type GetsFunction = (
  data: QuerySchema,
) => Promise<AxiosResponse<SyncCreateSchemas[]>>;

/**
 * Defines functions for creating, updating, and retrieving records in a synchronized table.
 *
 * @interface SyncTableFunctions
 *
 * @property {CreatesFunction} Creates - Function for creating records.
 * @property {UpdatesFunction} Updates - Function for updating records.
 * @property {GetsFunction} Pull - Function for retrieving records.
 */
export interface SyncTableFunctions<
  C extends SyncCreateSchemas,
  U extends SyncUpdateSchemas,
> {
  [SyncOperation.Creates]: CreatesFunction<C>;
  [SyncOperation.Updates]: UpdatesFunction<U>;
  [SyncType.Pull]: GetsFunction;
}

/**
 * Defines the API functions for synchronization for a specific table.
 *
 * @interface SyncApiFunctions
 *
 * @property {SyncTableFunctions} statTable - API functions for the 'statTable' table.
 */
export interface SyncApiFunctions {
  [syncDbTables.statTable]: SyncTableFunctions<
    StatCreateSchema,
    StatUpdateSchema
  >;
  [syncDbTables.moodTable]: SyncTableFunctions<
    MoodCreateSchema,
    MoodUpdateSchema
  >;
  [syncDbTables.moodTagTable]: SyncTableFunctions<
    MoodTagCreateSchema,
    MoodTagUpdateSchema
  >;
  [syncDbTables.moodTagLinkTable]: SyncTableFunctions<
    MoodTagLinkCreateSchema,
    MoodTagLinkUpdateSchema
  >;
  [syncDbTables.nutritionTable]: SyncTableFunctions<
    NutritionCreateSchema,
    NutritionUpdateSchema
  >;
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
  last_synced?: string | null;
  sync_type: SyncType;
  sync_operation: SyncOperation;
}
