// Typing
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {
  processSyncTypePush,
  processSyncTypePull,
} from '@services/db/sync/SyncTypes';
import {TimestampTimezone} from '@services/date/Type';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';

// Logger
import logger from '@utils/Logger';

// Functions
import {getCurrentTimestampTimezone} from '@services/date/Functions';

/**
 * Runs the synchronization process for pulling and pushing data between the local and remote databases.
 * This function iterates through each table in the API functions and performs synchronization operations.
 *
 * @returns {Promise<void>} A Promise that resolves when the synchronization process is completed.
 * @throws {Error} If an error occurs during the synchronization process.
 */
export const runSyncProcess = async (): Promise<void> => {
  try {
    // Iterate through each table in apiFunctions
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing sync type '${SyncType.Pull}' for table: '${tableName}'`,
      );

      // Need a sync stsrt time here to make sure we don't miss out on any data created during thr sync process
      const timestampTimezone: TimestampTimezone =
        getCurrentTimestampTimezone();
      const syncStart: string = timestampTimezone.timestamp;

      // Process synchronization pull for create operations
      await processSyncTypePull(
        tableName as syncDbTables,
        tableFunctions,
        SyncOperation.Creates,
        syncStart,
      );

      // Process synchronization pull for update operations
      await processSyncTypePull(
        tableName as syncDbTables,
        tableFunctions,
        SyncOperation.Updates,
        syncStart,
      );

      // Log information about the completion of synchronization pull
      logger.info(
        `Sync '${SyncType.Pull}' completed successfully for table: '${tableName}'.`,
      );

      logger.info(
        `Processing sync type '${SyncType.Push}' for table: '${tableName}'`,
      );

      // Trigger synchronization push for create operation
      await processSyncTypePush(
        tableName as syncDbTables,
        tableFunctions,
        SyncOperation.Creates,
        syncStart,
      );

      // Trigger synchronization push for update operation
      await processSyncTypePush(
        tableName as syncDbTables,
        tableFunctions,
        SyncOperation.Updates,
        syncStart,
      );

      logger.info(
        `Sync type ${SyncType.Push} completed successfully for table: '${tableName}'.`,
      );
    }

    logger.info(
      `Sync types '${SyncType.Pull}' and '${SyncType.Push}' completed successfully for all tables.`,
    );
  } catch (error) {
    logger.error('Error processing synchronization:', error);
    throw error;
  }
};
