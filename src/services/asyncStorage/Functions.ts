// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SyncErrorDumpApi} from '@services/api/ApiService';

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
import {SyncOperation} from '@services/api/swagger/data-contracts';
import {SyncType} from '@services/api/swagger/data-contracts';

/**
 * Stores failed synchronization push errors in AsyncStorage for a specific table and Sync operation.
 *
 * @param tableName - The name of the synchronization table.
 * @param syncOperation - The type of synchronization operation (e.g., Creates, Updates).
 * @param failedSyncPushErrors - An array of failed synchronization items to be stored.
 * @returns A promise that resolves when the storage operation is successful.
 * @throws If there is an error retrieving, parsing, or storing synchronization push errors.
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

    syncPushErrorsObject[tableName] = syncPushErrorsObject[tableName] || {};
    syncPushErrorsObject[tableName]![syncOperation] =
      syncPushErrorsObject[tableName]![syncOperation] || {};

    for (const syncError of failedSyncPushErrors) {
      const rowUuid = (syncError as any)[`${tableName}_id`];

      if (rowUuid in tableSyncPushErrors) {
        if (tableSyncPushErrors[rowUuid].retries >= maxSyncPushRetry) {
          const row: T = tableSyncPushErrors[rowUuid].data;
          await SyncErrorDumpApi.createCreate({
            table_name: tableName,
            row_id: (row as any)[`${tableName}_id`],
            data: row,
            created_at: 'created_at' in row ? row.created_at : null,
            updated_at: 'updated_at' in row ? row.updated_at : null,
            timezone: 'timezone' in row ? row.timezone : null,
            sync_type: SyncType.Push,
            sync_operation: syncOperation,
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

    syncPushErrorsObject[tableName]![syncOperation] = tableSyncPushErrors;
    await AsyncStorage.setItem(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify(syncPushErrorsObject),
    );
  } catch (error) {
    throw new Error(`Failed to store synchronization push errors: ${error}`);
  }
};

/**
 * Retrieves a list of failed synchronization pushes for a specific table and Sync operation.
 * @param tableName - The name of the synchronization table.
 * @param syncOperation - The type of synchronization operation (e.g., Creates, Updates).
 * @returns A promise that resolves to an array of failed synchronization items.
 * @throws If there is an error retrieving or parsing synchronization push errors.
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

    if (syncPushErrorsStore !== null) {
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
          `No failed Sync Pushes for table '${tableName}' Sync operation '${syncOperation}'`,
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
 */
export const getFailedSyncPushesUpdatesForTable = async (
  tableName: syncDbTables,
): Promise<SyncUpdateSchemas[]> => {
  return getFailedSyncPushesForTable<SyncUpdateSchemas>(
    tableName,
    SyncOperation.Updates,
  );
};

/**
 * Deletes entries from the synchronization push errors stored in AsyncStorage for objects that have
 * been successfully synchronized.
 *
 * This function updates the stored synchronization errors by removing the entries for objects
 * identified by their IDs in `successfulSyncIds`. It targets a specific table and synchronization
 * operation type (e.g., creation, update).
 *
 * @param tableName The name of the table in the database for which synchronization errors are stored.
 * @param successfulSyncIds An array of string IDs for objects that have been successfully synchronized
 *                          and should be removed from the error log.
 * @param syncOperation The type of synchronization operation (e.g., Creates, Updates) for which
 *                      the errors should be cleared.
 * @returns A promise that resolves to `void`. The promise will reject if there's an error accessing
 *          AsyncStorage or if the stored sync errors cannot be parsed or updated.
 * @throws Will throw an error if the AsyncStorage operations fail or if there's an issue with
 *         JSON parsing or serialization.
 */
export const deleteSuccessfulSyncPushErrors = async <T>(
  tableName: syncDbTables,
  successfulSyncIds: string[],
  syncOperation: SyncOperation,
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

    syncPushErrorsObject[tableName] = syncPushErrorsObject[tableName] || {};
    syncPushErrorsObject[tableName]![syncOperation] =
      syncPushErrorsObject[tableName]![syncOperation] || {};

    successfulSyncIds.forEach(id => {
      if (id in tableSyncPushErrors) {
        delete tableSyncPushErrors[id];
      }
    });
    syncPushErrorsObject[tableName]![syncOperation] = tableSyncPushErrors;
    await AsyncStorage.setItem(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify(syncPushErrorsObject),
    );
  } catch (error) {
    throw new Error(
      `Failed to delete successfully synchronized push errors: ${error}`,
    );
  }
};
