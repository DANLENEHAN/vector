// Typing
import {AxiosResponse} from 'axios';
import {
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
} from './types';
import {SyncOperation, SyncType} from '@shared/enums';
import {syncDbTables, timestampFields} from '@shared/Constants';

// Functions
import {
  convertListToSyncUpdateSchemas,
  insertSyncUpdate,
} from '@services/db/sync/SyncUtils';

// Logger
import logger from '@utils/Logger';

export const processUpdatesSyncTypePush = async (
  rows: SyncCreateSchemas[],
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions,
) => {
  let successfulRequests = 0;

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
          logger.error('Unexpected response status code: ', response.status);
        }
      } catch (error) {
        logger.error('Error sending request:', error);
      }
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced: lastRow[timestampFields.updatedAt],
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });
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
          logger.error('Unexpected response status code: ', response.status);
        }
      } catch (error) {
        logger.error('Error sending request:', error);
      }
    }
    await insertSyncUpdate({
      table_name: tableName,
      last_synced: lastRow[timestampFields.createdAt],
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${SyncOperation.Creates}' completed successfully on table: '${tableName}'. ${successfulRequests}/${rowsToSync.length} succeeded.`,
  );
};
