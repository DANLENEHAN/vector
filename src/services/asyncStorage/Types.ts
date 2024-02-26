// Constants
import {syncDbTables} from '@shared/Constants';

// Types
import {SyncOperation} from '@services/api/swagger/data-contracts';

/**
 * Represents an item containing information about a failed synchronization push.
 *
 * @typeParam T - The type of data associated with the failed synchronization push.
 *
 * @property retries - The number of retries attempted for the synchronization push.
 * @property data - The data associated with the failed synchronization push.
 *
 */
export type SyncPushErrorItem<T> = {
  retries: number;
  data: T;
};

/**
 * Represents an object structure for storing failed synchronization pushes categorized by table and Sync operation.
 *
 * @typeParam T - The type of data associated with the failed synchronization pushes.
 *
 * @property [key in syncDbTables] - The synchronization table.
 * @property [SyncOperation.Creates] - An optional object containing failed creates categorized by row ID.
 * @property [SyncOperation.Updates] - An optional object containing failed updates categorized by row ID.
 *
 */
export type FailedSyncPushError<T> = {
  [key in syncDbTables]?: {
    [SyncOperation.Creates]?: {
      [key: string]: SyncPushErrorItem<T>;
    };
    [SyncOperation.Updates]?: {
      [key: string]: SyncPushErrorItem<T>;
    };
  };
};

/**
 * Interface representing the mapping of device identifiers within the application.
 *
 * @property {string | null} internalDeviceId - A unique identifier set by the device itself.
 * This could be a hardware serial number or any other unique hardware-based ID. It can be `null`
 * if the identifier is not set or retrievable.
 *
 * @property {string | null} deviceId - A unique identifier assigned by the application to the device.
 * This is used for tracking or linking the device within the application's backend systems. It can also
 * be `null` if the identifier has not yet been assigned or is not available.
 */
export interface DeviceIdMap {
  internalDeviceId: string | null;
  deviceId: string | null;
}
