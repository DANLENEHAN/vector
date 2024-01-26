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
 * Stores failed synchronization push errors in AsyncStorage for a specific table and sync operation.
 *
 * @param tableName - The name of the synchronization table.
 * @param syncOperation - The type of synchronization operation (e.g., Creates, Updates).
 * @param failedSyncPushErrors - An array of failed synchronization items to be stored.
 * @returns A promise that resolves when the storage operation is successful.
 * @throws If there is an error retrieving, parsing, or storing synchronization push errors.
 *
 * @example
 * const failedCreates: SyncCreateSchemas[] = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 * ];
 * await storeFailedSyncPushErrors<SyncCreateSchemas>('myTable', SyncOperation.Creates, failedCreates);
 */
export const storeFailedSyncPushErrors = async <
  T extends SyncCreateSchemas | SyncUpdateSchemas,
>(
  tableName: syncDbTables,
  syncOperation: SyncOperation,
  failedSyncPushErrors: T[],
): Promise<void> => {
  try {
    const syncPushErrorsStore = await AsyncStorage.getItem(
      AsyncStorageKeys.SyncPushErrors,
    );

    let syncPushErrorsObject: FailedSyncPushError<T> = {};

    if (syncPushErrorsStore !== null) {
      try {
        syncPushErrorsObject = JSON.parse(syncPushErrorsStore);
      } catch (error) {
        logger.warn(
          `${AsyncStorageKeys.SyncPushErrors} key has invalid JSON. Rebuilding...`,
        );
      }
    }

    const tableSyncPushErrors: {[key: string]: SyncPushErrorItem<T>} =
      (syncPushErrorsObject &&
        syncPushErrorsObject[tableName] &&
        syncPushErrorsObject[tableName]?.[syncOperation]) ??
      {};

    for (const syncError of failedSyncPushErrors) {
      const rowUuid = syncError[`${tableName}_id`];

      if (rowUuid in tableSyncPushErrors) {
        if (tableSyncPushErrors[rowUuid].retries === maxSyncPushRetry) {
          const row: T = tableSyncPushErrors[rowUuid].data;
          await SyncErrorDumpApi.createCreate({
            table_name: tableName,
            row_id: row[`${tableName}_id`],
            data: row,
            created_at: 'created_at' in row ? row.created_at : 'update_please',
            updated_at: row.updated_at,
            timezone: 'timezone' in row ? row.timezone : 'update_please',
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
    throw new Error(`Failed to store synchronization push errors: ${error}`);
  }
};

/**
 * Retrieves a list of failed synchronization pushes for a specific table and sync operation.
 * @param tableName - The name of the synchronization table.
 * @param syncOperation - The type of synchronization operation (e.g., Creates, Updates).
 * @returns A promise that resolves to an array of failed synchronization items.
 * @throws If there is an error retrieving or parsing synchronization push errors.
 * @example
 * const failedCreates = await getFailedSyncPushesForTable<SyncCreateSchemas>('myTable', SyncOperation.Creates);
 */
const getFailedSyncPushesForTable = async <T>(
  tableName: syncDbTables,
  syncOperation: SyncOperation,
): Promise<T[]> => {
  let tableSyncPushErrors: SyncPushErrorItem<T>[] = [];
  let failedPushErrors: T[] = [];

  try {
    const syncPushErrorsStore = await AsyncStorage.getItem(
      AsyncStorageKeys.SyncPushErrors,
    );

    if (syncPushErrorsStore === null) {
      logger.warn(`Key not found: ${AsyncStorageKeys.SyncPushErrors}`);
    } else {
      const parsedData: FailedSyncPushError<T> =
        JSON.parse(syncPushErrorsStore);

      if (
        parsedData &&
        parsedData[tableName] &&
        parsedData[tableName]?.[syncOperation]
      ) {
        const operationData = parsedData[tableName]?.[syncOperation];
        if (operationData) {
          tableSyncPushErrors = Object.values(operationData);
          failedPushErrors = tableSyncPushErrors.map(item => item.data);
        }
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
  return failedPushErrors;
};

/**
 * Retrieves a list of failed synchronization pushes for creating records in a specific table.
 * @param tableName - The name of the synchronization table.
 * @returns A promise that resolves to an array of failed synchronization creates.
 * @throws If there is an error retrieving or parsing synchronization push errors.
 * @example
 * const failedCreates = await getFailedSyncPushesCreatesForTable('myTable');
 */
export const getFailedSyncPushesCreatesForTable = async (
  tableName: syncDbTables,
): Promise<SyncCreateSchemas[]> => {
  return getFailedSyncPushesForTable<SyncCreateSchemas>(
    tableName,
    SyncOperation.Creates,
  );
};

/**
 * Retrieves a list of failed synchronization pushes for updating records in a specific table.
 * @param tableName - The name of the synchronization table.
 * @returns A promise that resolves to an array of failed synchronization updates.
 * @throws If there is an error retrieving or parsing synchronization push errors.
 * @example
 * const failedUpdates = await getFailedSyncPushesUpdatesForTable('myTable');
 */
export const getFailedSyncPushesUpdatesForTable = async (
  tableName: syncDbTables,
): Promise<SyncUpdateSchemas[]> => {
  return getFailedSyncPushesForTable<SyncUpdateSchemas>(
    tableName,
    SyncOperation.Updates,
  );
};
