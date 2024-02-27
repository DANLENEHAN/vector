// Functions
import {generateDeletionQuery} from '@services/db/Queries';
import {getRowByIdQuery} from '@services/db/sync/Queries';
import {executeSqlBatch} from '@services/db/SqlClient';
import 'react-native-get-random-values';
// Types
import {timestampFields} from '@shared/Constants';
// Logger
import logger from '@utils/Logger';

/**
 * Retrieves the timestamp value associated with a specific row in the specified table.
 *
 * @param {string} tableName - The name of the table where the row is located.
 * @param {timestampFields} timestampField - The name of the field containing the timestamp value.
 * @param {string} uuid - The unique identifier of the row.
 * @returns {Promise<string | null>} A promise resolving to the timestamp value if the row is found, otherwise null.
 * @throws {Error} Throws an error if there's a problem executing the SQL query.
 */
export const getTimestampForRow = async (
  tableName: string,
  timestampField: timestampFields,
  uuid: string,
): Promise<string | null> => {
  const results = await executeSqlBatch([
    {
      sqlStatement: getRowByIdQuery(tableName, uuid),
    },
  ]);
  const executionResult = results[0];
  if (executionResult.error) {
    logger.error(
      `Error retrieving timestamp for table: ${tableName} uuid: ${uuid} column: ${timestampField} error: ${executionResult.error}`,
    );
    return null;
  } else {
    return executionResult.result.length === 1
      ? executionResult.result[0][timestampField]
      : null;
  }
};

/**
 * Deletes all tables in the SQLite database.
 *
 * @returns {Promise<void>} A promise that resolves when the deletion process is complete.
 * @throws {Error} Throws an error if there's a problem executing the deletion SQL queries.
 */
export const deleteDB = async (): Promise<void> => {
  logger.info('Deleting DB tables. Hold on tight!');

  const result = await executeSqlBatch([
    {
      sqlStatement: generateDeletionQuery,
    },
  ]);
  if (result[0].error) {
    logger.error(`DB deletion unsuccessful error: ${result[0].error}`);
  } else {
    const deleteStatements = result[0].result.map((item: Object) => {
      return {sqlStatement: Object.values(item)[0]};
    });
    const deleteResults = await executeSqlBatch(deleteStatements);
    for (const result of deleteResults) {
      if (result.error) {
        logger.warn(
          `SQL '${result.originalQuery.sqlStatement} failed with error: ${result.error}`,
        );
      }
    }
  }
  logger.info('DB deletion finished');
};
