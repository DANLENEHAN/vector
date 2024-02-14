// Types
import {alembicTable} from '@services/db/Types';
import {RowData} from '@services/db/Types';
import {timestampFields} from '@shared/Constants';
import {SqlQuery, ExecutionResult} from '@services/db/Types';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {getTimestampForRow} from './QueryExecutors';
import 'react-native-get-random-values';
// Logger
import logger from '@utils/Logger';

/**
 * Retrieves a subset of the given object with key-value pairs starting after a specified key.
 * If the specified start key is null, the function returns all key-value pairs from the object.
 * If the specified start key is found, retrieval starts from the key immediately following it.
 *
 * @param {Object} revisionObject - The object from which to retrieve key-value pairs.
 * @param {string | null} startKey - The key after which to start retrieval. If null, retrieval includes all key-value pairs.
 * @returns {Object} An object containing key-value pairs after the specified start key,
 *                   or all pairs if startKey is null.
 */
export const getValuesAfterSpecifiedKey = (
  revisionObject: {[key: string]: string[]},
  startKey: string | null,
): {[key: string]: string[]} => {
  // If startKey is null, return the entire object
  if (startKey === null) {
    return revisionObject;
  }

  let startKeyFound = false;
  return Object.entries(revisionObject).reduce((result, [key, value]) => {
    if (startKeyFound) {
      result[key] = value;
    }

    // Sets startKeyFound to true for the key immediately after the matching startKey
    if (startKey === key) {
      startKeyFound = true;
    }

    return result;
  }, {} as {[key: string]: string[]});
};

export const runDbMigrationProcess = async (revisionObject: {
  [key: string]: string[];
}): Promise<void> => {
  try {
    // Fetch the revision ID from the database
    const migrationResult: ExecutionResult<any>[] = await executeSqlBatch([
      {
        sqlStatement: `SELECT version_num FROM ${alembicTable};`,
        params: [],
      },
    ]);

    // Extract the revision ID from the query result
    const revisionId: string =
      migrationResult.length === 1
        ? migrationResult[0].result[0].version_num
        : null;

    if (!revisionId) {
      throw new Error('No revision ID found in the database.');
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
          params: [],
        });
      });
    }

    // Execute migration queries in a batch
    const results: ExecutionResult<any>[] = await executeSqlBatch(
      migrationQueries,
    );

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

export const insertRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

  const schema = Object.keys(data[0]);
  const columns = schema.join(', ');

  try {
    const results = await executeSqlBatch(
      data.map(row => ({
        sqlStatement: `INSERT INTO ${tableName} (${columns}) VALUES (${schema
          .map(() => '?')
          .join(', ')})`,
        params: Object.values(row),
      })),
    );

    results.forEach((result, index) => {
      if (result.error) {
        logger.error(
          `Error during insertion of row ${index + 1}: ${result.error}`,
        );
      } else {
        logger.info(
          `Successfully inserted row ${index + 1} in '${tableName}'.`,
        );
      }
    });
  } catch (error) {
    logger.error('Error during insertion:', error);
    throw error;
  }
};

export const updateRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    logger.warn('No data to update.');
    return;
  }

  let replaceCount = 0;
  const schema = Object.keys(data[0]);

  const columns = schema.join(', ');
  const placeholders = `(${Object.keys(schema)
    .map(() => '?')
    .join(', ')})`;

  const filteredData = data.filter(async newRowObject => {
    const rowIdColumn = `${tableName}_id`;
    const rowId = newRowObject[rowIdColumn];
    const currentRowTimestamp = await getTimestampForRow(
      tableName,
      timestampFields.updatedAt,
      rowId,
    );
    return (
      currentRowTimestamp === null ||
      newRowObject[timestampFields.updatedAt] > currentRowTimestamp
    );
  });

  const queries: SqlQuery[] = filteredData.map(newRowObject => ({
    sqlStatement: `REPLACE INTO ${tableName} (${columns}) VALUES ${placeholders}`,
    params: Object.values(newRowObject),
  }));

  try {
    const results: ExecutionResult<any>[] = await executeSqlBatch(queries);

    results.forEach(result => {
      if (result.error) {
        logger.error(`Error updating rows: ${result.error}`);
      } else {
        replaceCount++;
      }
    });

    logger.info(
      `Successfully replaced ${replaceCount} row${
        replaceCount !== 1 ? 's' : ''
      } in '${tableName}' out of the ${
        filteredData.length
      } pulled in the sync.`,
    );
  } catch (error) {
    logger.error('Error during updating rows:', error);
    throw error;
  }
};
