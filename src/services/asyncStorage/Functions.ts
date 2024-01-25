/*
	This file contains utility functions that are used throughout the application.
*/

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import {
  FailedSyncPushError,
  SyncPushErrorItem,
} from '@services/asyncStorage/Types';
import {SyncCreateSchemas, SyncUpdateSchemas} from '@services/db/sync/Types';

// Constants
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import {syncDbTables} from '@shared/Constants';
import {maxSyncPushRetry} from '@services/db/sync/Constants';
import logger from '@utils/Logger';
import {SyncOperation} from '@shared/Enums';
import {SyncErrorDump} from '@services/api/swagger/SyncErrorDump';
import api from '@services/api/ApiService';

export const SyncErrorDumpApi = new SyncErrorDump(api);

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
  syncOperation: SyncOperation,
  failedSyncPushErrors: SyncCreateSchemas[] | SyncUpdateSchemas[],
): Promise<void> => {
  try {
    const syncPushErrorsStore = await AsyncStorage.getItem(
      AsyncStorageKeys.SyncPushErrors,
    );

    let syncPushErrorsObject: FailedSyncPushError = {};

    if (syncPushErrorsStore !== null) {
      try {
        syncPushErrorsObject = JSON.parse(syncPushErrorsStore);
      } catch (error) {
        logger.warn(
          `${AsyncStorageKeys.SyncPushErrors} key has invalid JSON. Rebuilding...`,
        );
      }
    }
    const tableSyncPushErrors: SyncPushErrorItem =
      (syncPushErrorsObject &&
        syncPushErrorsObject[tableName] &&
        syncPushErrorsObject[tableName][syncOperation]) ??
      {};

    for (const syncError of failedSyncPushErrors) {
      // uuid value for the row
      const rowUuid = syncError[`${tableName}_id`];

      // Ensure ts this won't be null
      if (rowUuid in tableSyncPushErrors) {
        if (tableSyncPushErrors[rowUuid].retries > maxSyncPushRetry) {
          const row: SyncCreateSchemas = tableSyncPushErrors[rowUuid].data;
          await SyncErrorDumpApi.createCreate({
            table_name: tableName,
            row_id: row[`${tableName}_id`],
            data: row,
            created_at: row.created_at,
            updated_at: row.updated_at,
            timezone: row.timezone,
          });
          delete tableSyncPushErrors[rowUuid];
        } else {
          tableSyncPushErrors[rowUuid].retries++;
        }
      } else {
        tableSyncPushErrors[rowUuid] = {
          retries: 1,
          data: syncError,
        };
      }
    }

    syncPushErrorsObject = {
      [tableName]: {
        [syncOperation]: tableSyncPushErrors,
      },
    };

    await AsyncStorage.setItem(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify(syncPushErrorsObject),
    );
  } catch (error) {
    // Handle any unexpected errors during storage
    throw new Error(`Failed to store synchronization push errors: ${error}`);
  }
};

/**
 * Retrieves the failed synchronization push errors for a specific table from AsyncStorage.
 *
 * @async
 * @param {syncDbTables} tableName - The name of the table for which to retrieve failed synchronization push errors.
 * @returns {Array} - An array containing the failed synchronization push errors for the specified table.
 *                   If the data is not found or has an unexpected structure, an empty array is returned.
 * @throws {Error} - If there is an error during the retrieval or parsing of synchronization push errors,
 *                   an error message is logged, and the function may rethrow the error or return an appropriate value.
 *
 * @example
 * // Usage example:
 * const tableName = 'exampleTable';
 * const failedPushErrors = await getFailedSyncPushesForTable(tableName);
 * logger.info(failedPushErrors);
 */
export const getFailedSyncPushesForTable = async (
  tableName: syncDbTables,
  syncOperation: SyncOperation,
): Promise<SyncCreateSchemas[]> => {
  let tableSyncPushErrors = [];

  try {
    const syncPushErrorsStore = await AsyncStorage.getItem(
      AsyncStorageKeys.SyncPushErrors,
    );

    if (syncPushErrorsStore === null) {
      logger.warn(`Key not found: ${AsyncStorageKeys.SyncPushErrors}`);
    } else {
      const parsedData = JSON.parse(syncPushErrorsStore);

      if (
        parsedData &&
        parsedData[tableName] &&
        parsedData[tableName][syncOperation]
      ) {
        tableSyncPushErrors = Object.values(
          parsedData[tableName][syncOperation],
        );
        tableSyncPushErrors = tableSyncPushErrors.map(item => item.data);
      } else {
        logger.info(
          `No failed Sync Pushes for table '${tableName}' sync operation '${syncOperation}'`,
        );
      }
    }
  } catch (error) {
    logger.warn(
      `Failed to retrieve failed sync pushes for table ${tableName}: ${error}`,
    );
  }
  return tableSyncPushErrors;
};
