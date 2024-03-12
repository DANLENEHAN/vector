// Types
import {alembicTable} from '@services/db/Constants';
import {SqlQuery, ExecutionResult} from '@services/db/Types';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {getValuesAfterSpecifiedKey} from '@shared/Functions';
// Logger
import logger from '@utils/Logger';

/**
 * Runs the database migration process based on the provided revision object.
 *
 * @param {Object} revisionObject - An object containing revision IDs as keys and an array of SQL commands as values.
 * @returns {Promise<void>} A promise that resolves when the migration process is complete.
 * @throws {Error} Throws an error if there's a problem executing the migration queries or handling the migration process.
 */
export const runDbMigrationProcess = async (revisionObject: {
  [key: string]: string[];
}): Promise<void> => {
  try {
    // Fetch the revision ID from the database
    const migrationResult: ExecutionResult<{version_num: string}>[] =
      await executeSqlBatch([
        {
          sqlStatement: `SELECT version_num FROM ${alembicTable};`,
        },
      ]);

    // Extract the revision ID from the query result
    let revisionId: string | null;
    if (migrationResult[0].error) {
      revisionId = null;
    } else {
      revisionId = migrationResult[0].result
        ? migrationResult[0].result[0].version_num
        : null;
    }

    // Get the revisions to process based on the fetched revision ID
    const revisionsToProcess = getValuesAfterSpecifiedKey(
      revisionObject,
      revisionId,
    );

    if (Object.keys(revisionsToProcess).length === 0) {
      logger.info('No revisions to process. Moving on...');
      return;
    }

    // Construct migration queries from the revisions to process
    const migrationQueries: SqlQuery[] = [];
    for (const revisionID_ in revisionsToProcess) {
      const sqlCommands = revisionObject[revisionID_];
      sqlCommands.forEach(sqlCommand => {
        migrationQueries.push({
          sqlStatement: sqlCommand,
        });
      });
    }

    // Execute migration queries in a batch
    const results: ExecutionResult<{}>[] = await executeSqlBatch(
      migrationQueries,
    );

    // Handle the results of migration queries
    results.forEach(result => {
      if (result.error) {
        logger.error(`Error applying migration sql ${result.error}`);
        throw new Error(`Error applying migration sql ${result.error}`);
      }
    });
    logger.info('Migrations complete...');
  } catch (error) {
    logger.error('Error applying migrations:', error);
    throw error;
  }
};
