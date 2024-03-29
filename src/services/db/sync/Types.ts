import {AxiosResponse} from 'axios';

// Typing
import {
  ClientSessionEventCreateSchema,
  ClientSessionEventUpdateSchema,
  DeviceCreateSchema,
  DeviceUpdateSchema,
  SyncOperation,
  SyncType,
  UserCreateSchema,
  UserUpdateSchema,
} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {
  BodyStatCreateSchema,
  BodyStatUpdateSchema,
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
import {timestampFields} from '@shared/Constants';

/**
 * Represents a schema for data that can be synchronized during a create operation.
 *
 * @class SyncCreateSchemas
 *
 * @description A schema for data that can be synchronized during a create operation.
 */
export type SyncCreateSchemas =
  | UserCreateSchema
  | BodyStatCreateSchema
  | MoodCreateSchema
  | MoodTagCreateSchema
  | MoodTagLinkCreateSchema
  | NutritionCreateSchema
  | ClientSessionEventCreateSchema
  | DeviceCreateSchema;

/**
 * Represents a schema for data that can be synchronized during an update operation.
 *
 * @class SyncUpdateSchemas
 *
 * @description A schema for data that can be synchronized during an update operation.
 */
export type SyncUpdateSchemas =
  | UserUpdateSchema
  | BodyStatUpdateSchema
  | MoodUpdateSchema
  | MoodTagUpdateSchema
  | MoodTagLinkUpdateSchema
  | NutritionUpdateSchema
  | ClientSessionEventUpdateSchema
  | DeviceUpdateSchema;

/**
 * Represents an object with synchronization information.
 *
 * @interface SyncObject
 *
 * @property {boolean} isSync - A flag indicating whether the object is synchronized.
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
export type GetsFunction = (
  data: QuerySchema,
) => Promise<AxiosResponse<SyncCreateSchemas[]>>;

/**
 * Defines functions for creating and updating records in a synchronized table, omitting retrieval operations.
 *
 * @interface SyncTableReadWriteFunctions
 *
 * @property {CreatesFunction} Creates - Function for creating records.
 * @property {UpdatesFunction} Updates - Function for updating records.
 */
export interface SyncTableReadWriteFunctions<
  C extends SyncCreateSchemas,
  U extends SyncUpdateSchemas,
> {
  [SyncOperation.Creates]: CreatesFunction<C>;
  [SyncOperation.Updates]: UpdatesFunction<U>;
  [SyncType.Pull]: GetsFunction;
}

/**
 * Defines the structure for synchronization table functions within a system tha
 * handles data synchronization across devices or services.
 * This interface maps specific sync operations and types to corresponding
 * function types that implement these operations.
 *
 * Type Parameters:
 * - C: Represents the create schema type that extends `SyncCreateSchemas`, which
 *      defines the structure for objects that can be created.
 * - U: Represents the update schema type that extends `SyncUpdateSchemas`, which
 *      outlines the structure for objects that can be updated.
 *
 * Properties:
 * - `[SyncOperation.Creates]`: This property is associated with the `CreatesFunction<C>`,
 *                              indicating a function type that handles the creation of
 *                              new records based on the create schema `C`.
 * - `[SyncOperation.Updates]`: This property is linked to the `UpdatesFunction<U>`,
 *                              signifying a function type that manages the updates
 *                              of existing records according to the update schema `U`.
 * - `[SyncType.Pull]`: This property corresponds to the `GetsFunction`, a function type
 *                      designed for retrieving (pulling) data, without specifying a
 *                      particular schema for the operation.
 *
 * The `SyncOperation` and `SyncType` are expected to be enumerations or similar
 * constructs that define possible synchronization operations (like create, update)
 * and synchronization types (like pull), respectively.
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
 * @property {SyncTableFunctions} bodyStatTable - API functions for the 'bodyStatTable' table.
 */
export interface SyncApiFunctions {
  [syncDbTables.userTable]: SyncTableReadWriteFunctions<
    UserCreateSchema,
    UserUpdateSchema
  >;
  [syncDbTables.bodyStatTable]: SyncTableReadWriteFunctions<
    BodyStatCreateSchema,
    BodyStatUpdateSchema
  >;
  [syncDbTables.moodTable]: SyncTableReadWriteFunctions<
    MoodCreateSchema,
    MoodUpdateSchema
  >;
  [syncDbTables.moodTagTable]: SyncTableReadWriteFunctions<
    MoodTagCreateSchema,
    MoodTagUpdateSchema
  >;
  [syncDbTables.moodTagLinkTable]: SyncTableReadWriteFunctions<
    MoodTagLinkCreateSchema,
    MoodTagLinkUpdateSchema
  >;
  [syncDbTables.nutritionTable]: SyncTableReadWriteFunctions<
    NutritionCreateSchema,
    NutritionUpdateSchema
  >;
  [syncDbTables.deviceTable]: SyncTableReadWriteFunctions<
    DeviceCreateSchema,
    DeviceUpdateSchema
  >;
  [syncDbTables.clientSessionEventTable]: SyncTableReadWriteFunctions<
    ClientSessionEventCreateSchema,
    ClientSessionEventUpdateSchema
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

/**
 * Defines the structure for storing the last synchronized timestamps for a specific table or data entity.
 *
 * This interface represents the timestamps indicating the last synchronization time for creation and update operations.
 * If no synchronization has occurred yet, the timestamps default to the Unix Epoch ('1970-01-01T00:00:00Z'),
 * representing a baseline date and time from which time is measured.
 *
 * Properties:
 * - `[timestampFields.createdAt]`: The timestamp of the last creation operation synchronized. Defaults to the Unix Epoch
 *   if no creation synchronization has occurred yet.
 *
 * - `[timestampFields.updatedAt]`: The timestamp of the last update operation synchronized. Defaults to the Unix Epoch
 *   if no update synchronization has occurred yet.
 *
 * Note: `timestampFields` is expected to be an object or enumeration that provides keys (e.g., 'createdAt', 'updatedAt')
 * for accessing specific timestamp fields. These keys should correspond to the fields used in the database or data source
 * being synchronized. The Unix Epoch is used as a default value to indicate the absence of prior synchronization.
 */
export interface LastSyncedTimestamps {
  [timestampFields.createdAt]: string;
  [timestampFields.updatedAt]: string;
}
