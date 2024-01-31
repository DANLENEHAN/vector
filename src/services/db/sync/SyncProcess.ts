// Typing
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {
  processSyncTypePush,
  processSyncTypePull,
} from '@services/db/sync/SyncTypes';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';

// Logger
import logger from '@utils/Logger';

/**
 * Process synchronization pull and push for all tables.
 *
 * This function iterates through the tables defined in the `apiFunctions` object and performs
 * synchronization pull and push operations for both create and update operations.
 *
 * @returns {Promise<void>} A promise that resolves when synchronization pull and push are completed successfully for all tables.
 * @throws {Error} Throws an error if there are issues with processing synchronization operations for any table.
 *
 * @description
 * The `runSyncProcess` function orchestrates synchronization pull and push operations for all tables. It sequentially
 * processes pull and push operations for each table, ensuring that synchronization is completed successfully.
 * If any error occurs during the process, it is logged, and the function throws an error.
 */
export const runSyncProcess = async (): Promise<void> => {
  try {
    // Iterate through each table in apiFunctions
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      logger.info(
        `Processing sync type '${SyncType.Pull}' for table: '${tableName}'`,
      );

      // Process synchronization pull for create operations
      await processSyncTypePull({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Creates,
      });

      // Process synchronization pull for update operations
      await processSyncTypePull({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Updates,
      });

      // Log information about the completion of synchronization pull
      logger.info(
        `Sync '${SyncType.Pull}' completed successfully for table: '${tableName}'.`,
      );

      logger.info(
        `Processing sync type '${SyncType.Push}' for table: '${tableName}'`,
      );

      // Trigger synchronization push for create operation
      await processSyncTypePush({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Creates,
      });

      // Trigger synchronization push for update operation
      await processSyncTypePush({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Updates,
      });

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
