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
  syncStart: string,
) => {
  let successfulRequests = 0;
  const failedPushes: SyncUpdateSchemas[] = [];
  const successfulPushUuids: string[] = [];
  const tableUuidColumn = `${tableName}_id`;

  // Get any previously failed UpdateSchemas
  const failedSyncPushesForTable: SyncUpdateSchemas[] =
    await getFailedSyncPushesUpdatesForTable(tableName);

  // Default the lastSyncedTimestamp to the syncStart.
  // In the event there are no rows or only failed rows
  // to sync this will be used.
  let lastSyncedTimestamp = syncStart;

  if (failedSyncPushesForTable.length === 0 && rows.length === 0) {
    logger.info(
      `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Updates}); (tableName)=(${tableName}) - has no rows to sync`,
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
          logger.warn(
            `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Updates}); (tableName)=(${tableName}) - received unexpected status code (${response.status})`,
          );
        }
      } catch (error) {
        logger.warn(
          `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Updates}); (tableName)=(${tableName}) - request failed with error (${error})`,
        );
        failedPushes.push(row);
      }
    }
    if (lastRow) {
      // The lastRow can be undefined if we're only
      // retrying failed rows with no new to process
      lastSyncedTimestamp = lastRow[timestampFields.updatedAt];
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

  await insertSyncUpdate({
    table_name: tableName,
    last_synced: lastSyncedTimestamp,
    sync_type: SyncType.Push,
    sync_operation: SyncOperation.Updates,
  });

  logger.info(
    `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${
      SyncOperation.Updates
    }); (tableName)=(${tableName}) - complete with (${successfulRequests}/${
      failedSyncPushesForTable.length + rows.length
    }) requests succeeded.`,
  );
};

export const processCreatesSyncTypePush = async (
  rowsToSync: SyncCreateSchemas[],
  tableName: syncDbTables,
  tableFunctions: SyncTableFunctions<SyncCreateSchemas, SyncUpdateSchemas>,
  syncStart: string,
) => {
  let successfulRequests = 0;

  const failedSyncPushesForTable: SyncCreateSchemas[] =
    await getFailedSyncPushesCreatesForTable(tableName);
  const allRowsToSync = [...failedSyncPushesForTable, ...rowsToSync];

  const failedPushes: SyncCreateSchemas[] = [];
  const successfulPushUuids: string[] = [];
  const tableUuidColumn = `${tableName}_id`;

  // Default the lastSyncedTimestamp to the syncStart.
  // In the event there are no rows or only failed rows
  // to sync this will be used.
  let lastSyncedTimestamp = syncStart;

  if (allRowsToSync.length === 0) {
    logger.info(
      `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Creates}); (tableName)=(${tableName}) - has no rows to sync`,
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
          logger.warn(
            `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Creates}); (tableName)=(${tableName}) - received unexpected status code (${response.status})`,
          );
          failedPushes.push(row);
        }
      } catch (error) {
        logger.warn(
          `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Creates}); (tableName)=(${tableName}) - request failed with error (${error})`,
        );
        failedPushes.push(row);
      }
    }
    if (lastRow) {
      // The lastRow can be undefined if we're only
      // retrying failed rows with no new to process
      lastSyncedTimestamp = lastRow[timestampFields.createdAt];
    }

    // Stored any unsuccessful pushes
    if (failedPushes.length > 0) {
      await storeFailedSyncPushErrors(
        tableName,
        SyncOperation.Creates,
        failedPushes,
      );
    }

    // Remove any successful rows that had previously failed
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

  await insertSyncUpdate({
    table_name: tableName,
    last_synced: lastSyncedTimestamp,
    sync_type: SyncType.Push,
    sync_operation: SyncOperation.Creates,
  });

  logger.info(
    `(Synctype)=(${SyncType.Push}); (SyncOperation)=(${SyncOperation.Creates}); (tableName)=(${tableName}) - complete with (${successfulRequests}/${allRowsToSync.length}) requests succeeded.`,
  );
};
