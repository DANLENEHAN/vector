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

export interface DeviceIdMap {
  // The unique Id of the device set
  // by the device itself
  internalDeviceId: string | null;
  // The unqiue Id of the device set
  // by us
  deviceId: string | null;
}
