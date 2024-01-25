// Typing
import {AxiosResponse} from 'axios';
import {
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
} from './Types';
import {SyncOperation, SyncType} from '@shared/Enums';
import {syncDbTables, timestampFields} from '@shared/Constants';

// Functions
import {
  convertListToSyncUpdateSchemas,
  insertSyncUpdate,
} from '@services/db/sync/SyncUtils';
import {storeFailedSyncPushErrors} from '@services/asyncStorage/Functions';

// Logger
import logger from '@utils/Logger';

export const processUpdatesSyncTypePush = async (
  rows: SyncCreateSchemas[],
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions,
) => {
  let successfulRequests = 0;

  const failedPushes: SyncUpdateSchemas[] = [];
  if (rows.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Push}' sync operation '${SyncOperation.Updates}'.`,
    );
  } else {
    const rowsToSync = convertListToSyncUpdateSchemas(rows);
    const lastRow: SyncCreateSchemas | SyncUpdateSchemas =
      rowsToSync.slice(-1)[0];

    for (const row of rowsToSync) {
      try {
        const response: AxiosResponse<void> = await tableFunctions[
          SyncOperation.Updates
        ](row, {isSync: true});

        if (response.status === 204) {
          successfulRequests++;
        } else {
          failedPushes.push(row);
          logger.error('Unexpected response status code: ', response.status);
        }
      } catch (error) {
        logger.error('Error sending request:', error);
        failedPushes.push(row);
      }
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced: lastRow[timestampFields.updatedAt],
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });
    if (failedPushes.length > 0) {
      storeFailedSyncPushErrors(tableName, SyncOperation.Updates, failedPushes);
    }
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${SyncOperation.Updates}' completed successfully on table: '${tableName}'. ${successfulRequests}/${rows.length} succeeded.`,
  );
};

export const processCreatesSyncTypePush = async (
  rowsToSync: SyncCreateSchemas[],
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions,
) => {
  let successfulRequests = 0;

  const failedPushes: SyncCreateSchemas[] = [];
  if (rowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' sync type '${SyncType.Push}' sync operation '${SyncOperation.Creates}'.`,
    );
  } else {
    const lastRow: SyncCreateSchemas | SyncUpdateSchemas =
      rowsToSync.slice(-1)[0];

    for (const row of rowsToSync) {
      try {
        const response: AxiosResponse<void> = await tableFunctions[
          SyncOperation.Creates
        ](row, {isSync: true});

        if (response.status === 201) {
          successfulRequests++;
        } else {
          failedPushes.push(row);
          logger.error('Unexpected response status code: ', response.status);
        }
      } catch (error) {
        logger.error('Error sending request:', error);
        failedPushes.push(row);
      }
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced: lastRow[timestampFields.createdAt],
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
    if (failedPushes.length > 0) {
      storeFailedSyncPushErrors(tableName, SyncOperation.Creates, failedPushes);
    }
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${SyncOperation.Creates}' completed successfully on table: '${tableName}'. ${successfulRequests}/${rowsToSync.length} succeeded.`,
  );
};
