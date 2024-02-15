// Functions
import {generateDeletionQuery} from '@services/db/Queries';
import {getRowByIdQuery} from './sync/Queries';
import {executeSqlBatch} from '@services/db/SqlClient';
import 'react-native-get-random-values';
// Types
import {timestampFields} from '@shared/Constants';
// Logger
import logger from '@utils/Logger';

export const getTimestampForRow = async (
  tableName: string,
  timestampField: timestampFields,
  uuid: string,
): Promise<string | null> => {
  const results = await executeSqlBatch([
    {
      sqlStatement: getRowByIdQuery(tableName, uuid),
      params: [],
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
