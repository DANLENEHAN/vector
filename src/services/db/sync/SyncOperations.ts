// Typing
import {AxiosResponse} from 'axios';
import {
  SyncTableFunctions,
  SyncCreateSchemas,
  SyncUpdateSchemas,
} from '@services/db/sync/Types';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables, timestampFields} from '@shared/Constants';

// Functions
import {
  convertListToSyncUpdateSchemas,
  insertSyncUpdate,
} from '@services/db/sync/Functions';
import {
  storeFailedSyncPushErrors,
  deleteSuccessfulSyncPushErrors,
} from '@services/asyncStorage/Functions';
import {
  getFailedSyncPushesCreatesForTable,
  getFailedSyncPushesUpdatesForTable,
} from '@services/asyncStorage/Functions';

// Logger
import logger from '@utils/Logger';

export const processUpdatesSyncTypePush = async (
  rows: SyncCreateSchemas[],
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>,
) => {
  let successfulRequests = 0;
  const failedPushes: SyncUpdateSchemas[] = [];
  const successfulPushUuids: string[] = [];
  const tableUuidColumn = `${tableName}_id`;

  // Get any previously failed UpdateSchemas
  const failedSyncPushesForTable: SyncUpdateSchemas[] =
    await getFailedSyncPushesUpdatesForTable(tableName);

  if (failedSyncPushesForTable.length === 0 && rows.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' Sync type '${SyncType.Push}' Sync operation '${SyncOperation.Updates}'.`,
    );
  } else {
    // Convert the CreateSchemas to UpdateSchemas
    const rowsToSync: SyncUpdateSchemas[] =
      convertListToSyncUpdateSchemas(rows);

    const allRowsToSync = [...failedSyncPushesForTable, ...rowsToSync];

    // Use the last (Latest Updated) row as the 'lastRow' not the last
    // of allRowsToSync
    const lastRow: SyncUpdateSchemas = rowsToSync.slice(-1)[0];

    for (const row of allRowsToSync) {
      try {
        const response: AxiosResponse<void> = await tableFunctions[
          SyncOperation.Updates
        ](row, {isSync: true});

        if (response.status === 204) {
          successfulPushUuids.push((row as any)[tableUuidColumn]);
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
    if (lastRow) {
      // The lastRow can be undefined if we're only
      // retrying failed rows with no new to process
      await insertSyncUpdate({
        table_name: tableName,
        last_synced: lastRow[timestampFields.updatedAt],
        sync_type: SyncType.Push,
        sync_operation: SyncOperation.Updates,
      });
    }
    if (failedPushes.length > 0) {
      storeFailedSyncPushErrors(tableName, SyncOperation.Updates, failedPushes);
    }
    if (successfulPushUuids.length > 0) {
      const newSyncUuids: string[] = rowsToSync.map(
        row => (row as any)[tableUuidColumn],
      );
      const syncPushErrorsToDelete: string[] = successfulPushUuids.filter(
        (uuid: string) => !newSyncUuids.includes(uuid),
      );
      if (syncPushErrorsToDelete.length > 0) {
        await deleteSuccessfulSyncPushErrors(
          tableName,
          successfulPushUuids.filter(
            (uuid: string) => !newSyncUuids.includes(uuid),
          ),
          SyncOperation.Updates,
        );
      }
    }
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${
      SyncOperation.Updates
    }' completed successfully on table: '${tableName}'. ${successfulRequests}/${
      failedSyncPushesForTable.length + rows.length
    } succeeded.`,
  );
};

export const processCreatesSyncTypePush = async (
  rowsToSync: SyncCreateSchemas[],
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>,
) => {
  let successfulRequests = 0;

  const failedSyncPushesForTable: SyncCreateSchemas[] =
    await getFailedSyncPushesCreatesForTable(tableName);
  const allRowsToSync = [...failedSyncPushesForTable, ...rowsToSync];

  const failedPushes: SyncCreateSchemas[] = [];
  const successfulPushUuids: string[] = [];
  const tableUuidColumn = `${tableName}_id`;

  if (allRowsToSync.length === 0) {
    logger.info(
      `No rows to sync for table '${tableName}' Sync type '${SyncType.Push}' Sync operation '${SyncOperation.Creates}'.`,
    );
  } else {
    // Use the last (Latest Updated) row as the 'lastRow' not the last
    // of allRowsToSync
    const lastRow: SyncCreateSchemas | SyncUpdateSchemas =
      rowsToSync.slice(-1)[0];

    for (const row of allRowsToSync) {
      try {
        const response: AxiosResponse<void> = await tableFunctions[
          SyncOperation.Creates
        ](row, {isSync: true});

        if (response.status === 201) {
          successfulPushUuids.push((row as any)[tableUuidColumn]);
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
    if (lastRow) {
      // The lastRow can be undefined if we're only
      // retrying failed rows with no new to process
      await insertSyncUpdate({
        table_name: tableName,
        last_synced: lastRow[timestampFields.createdAt],
        sync_type: SyncType.Push,
        sync_operation: SyncOperation.Creates,
      });
    }
    if (failedPushes.length > 0) {
      await storeFailedSyncPushErrors(
        tableName,
        SyncOperation.Creates,
        failedPushes,
      );
    }
    if (successfulPushUuids.length > 0) {
      const newSyncUuids: string[] = rowsToSync.map(
        row => (row as any)[tableUuidColumn],
      );
      const syncPushErrorsToDelete: string[] = successfulPushUuids.filter(
        (uuid: string) => !newSyncUuids.includes(uuid),
      );
      if (syncPushErrorsToDelete.length > 0) {
        await deleteSuccessfulSyncPushErrors(
          tableName,
          successfulPushUuids.filter(
            (uuid: string) => !newSyncUuids.includes(uuid),
          ),
          SyncOperation.Creates,
        );
      }
    }
  }
  logger.info(
    `Sync type '${SyncType.Push}' operation '${SyncOperation.Creates}' completed successfully on table: '${tableName}'. ${successfulRequests}/${allRowsToSync.length} succeeded.`,
  );
};
