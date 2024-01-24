// Constants
import {syncDbTables} from '@shared/Constants';

// Types
import {SyncCreateSchemas, SyncUpdateSchemas} from '@services/db/sync/types';

/**
 * Represents an item in the "stat" array for failed synchronization push errors.
 *
 * @interface SyncPushErrorItem
 * @property {number} retries - The number of retries for the synchronization push.
 * @property {SyncUpdateSchemas} data - The data associated with the synchronization push error,
 *                                      conforming to either the creation or update schema.
 */
export interface SyncPushErrorItem {
  retries: number;
  data: SyncCreateSchemas | SyncUpdateSchemas;
}

/**
 * Represents a collection of failed synchronization push errors for different database tables. The
 * ?/optionals in the keys are so each key of the enum syncDbTables aren't required whilst still making
 * sure if a key is provided it is of that enum.
 *
 * @type FailedSyncPushError
 * @property {SyncPushErrorItem} syncTable - The failed synchronization push error for the synchronization tracking table.
 * @property {SyncPushErrorItem} statTable - The failed synchronization push error for the statistics table.
 */
export type FailedSyncPushError = {
  [key in syncDbTables]?: {
    [key: string]: SyncPushErrorItem;
  };
};
