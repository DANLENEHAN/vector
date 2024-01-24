/*
	This file contains utility functions that are used throughout the application.
*/

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import {FailedSyncPushError} from './types';
import {SyncCreateSchemas, SyncUpdateSchemas} from '@services/db/sync/types';

// Constants
import {AsyncStorageKeys} from './Constants';
import {syncDbTables} from '@shared/Constants';
import {maxSyncPushRetry} from '@services/db/sync/Constants';
import logger from '@utils/logger';

/**
 * Gets the user details from AsyncStorage.
 *
 * @param {string} field_name - The name of the field to retrieve.
 * @returns {Promise<string>} A promise that resolves with the value of the field.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 * @example
 * // Example usage:
 * const field_name = 'username';
 * await getUserDetails(field_name);
 * // Returns the value of the username field.
 **/
export async function getUserDetails(field_name: string): Promise<any> {
  try {
    const user_details = await AsyncStorage.getItem('user-details-key');
    if (user_details) {
      const user_details_json = JSON.parse(user_details);
      if (field_name in user_details_json) {
        return user_details_json[field_name];
      } else {
        throw `Field ${field_name} not found in user details`;
      }
    } else {
      throw 'User details not found in AsyncStorage';
    }
  } catch (error) {
    return Promise.reject(new Error(`Error retrieving user details: ${error}`));
  }
}

/**
 * Stores information about failed synchronization push errors in asynchronous storage.
 *
 * @async
 * @function
 * @param {syncDbTables} tableName - The name of the table associated with the failed synchronization push errors.
 * @param {SyncCreateSchemas[] | SyncUpdateSchemas[]} failedSyncPushErrors - An array of synchronization push errors to be stored.
 * @returns {Promise<void>} A Promise that resolves once the storage operation is complete.
 *
 * @throws {Error} If there is an issue parsing the existing synchronization push errors from storage.
 *
 * @description
 * This function retrieves the current state of synchronization push errors from asynchronous storage,
 * updates the information based on the provided failed synchronization push errors, and then stores
 * the updated state back into asynchronous storage.
 *
 * If the existing storage contains invalid JSON for synchronization push errors, it logs a warning and
 * attempts to rebuild the synchronization push errors state.
 *
 * The function increments the retry count for each synchronization push error, and if the retry count
 * exceeds the defined maximum retry threshold (maxSyncPushRetry), it may trigger additional actions
 * such as pushing the error to a dump endpoint.
 *
 * @example
 * // Example usage:
 * const tableName = 'exampleTable';
 * const failedSyncPushErrors = [
 *   { exampleTable_id: 'uuid1', ...other properties },
 *   { exampleTable_id: 'uuid2', ...other properties },
 *   // ...
 * ];
 * await storeFailedSyncPushErrors(tableName, failedSyncPushErrors);
 */
export const storeFailedSyncPushErrors = async (
  tableName: syncDbTables,
  failedSyncPushErrors: SyncCreateSchemas[] | SyncUpdateSchemas[],
) => {
  const syncPushErrorsStore = await AsyncStorage.getItem(
    AsyncStorageKeys.SyncPushErrors,
  );

  let syncPushErrorsObject: FailedSyncPushError = {};
  if (syncPushErrorsStore !== null) {
    try {
      syncPushErrorsObject = JSON.parse(syncPushErrorsStore);
    } catch (error) {
      logger.warn(
        `${AsyncStorageKeys.SyncPushErrors} key invalid JSON. Rebuilding...`,
      );
    }
  }

  const tableSyncPushErrors = syncPushErrorsObject[tableName] ?? {};
  for (const failedSyncPushError of failedSyncPushErrors) {
    // uuid value for the row
    const key = failedSyncPushError[`${tableName}_id`];

    // ! is used to ensure ts this won't be null
    if (key in tableSyncPushErrors) {
      if (tableSyncPushErrors[key].retries > maxSyncPushRetry) {
        // push to dump endpoint
      } else {
        tableSyncPushErrors[key].retries++;
      }
    } else {
      tableSyncPushErrors[key] = {
        retries: 1,
        data: failedSyncPushError,
      };
    }
  }
  syncPushErrorsObject[tableName] = tableSyncPushErrors;
  await AsyncStorage.setItem(
    AsyncStorageKeys.SyncPushErrors,
    JSON.stringify(syncPushErrorsObject),
  );

  return;
};
