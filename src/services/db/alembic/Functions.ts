// Types
import {alembicTable} from '@services/db/Types';
import {SqlQuery, ExecutionResult} from '@services/db/Types';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {getValuesAfterSpecifiedKey} from '@shared/Functions';
// Logger
import logger from '@utils/Logger';

export const runDbMigrationProcess = async (revisionObject: {
  [key: string]: string[];
}): Promise<void> => {
  try {
    // Fetch the revision ID from the database
    const migrationResult: ExecutionResult[] = await executeSqlBatch([
      {
        sqlStatement: `SELECT version_num FROM ${alembicTable};`,
      },
    ]);

    // Extract the revision ID from the query result
    const revisionId: string = migrationResult[0].result
      ? migrationResult[0].result[0].version_num
      : null;

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
    const results: ExecutionResult[] = await executeSqlBatch(migrationQueries);

    // Handle the results of migration queries
    results.forEach((result, index) => {
      const revisionID_ = Object.keys(revisionsToProcess)[index];
      if (result.error) {
        logger.error(
          `Error applying migrations for ${revisionID_}: ${result.error}`,
        );
        // Consider if this is a recoverable error or if it requires manual intervention
        throw new Error(
          `Error applying migrations for ${revisionID_}: ${result.error}`,
        );
      } else {
        logger.info(`Migration for ${revisionID_} applied successfully`);
      }
    });
  } catch (error) {
    logger.error('Error applying migrations:', error);
    throw error; // Rethrow the error for higher-level handling
  }
};
