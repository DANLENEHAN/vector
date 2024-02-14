import {Transaction} from 'react-native-sqlite-storage';
// Functions
import {generateDeletionQuery} from '@services/db/Queries';
import {getRowByIdQuery} from './sync/Queries';
import {executeSqlBatch} from '@services/db/TransactionFunctions';
import 'react-native-get-random-values';
// Logger
import logger from '@utils/Logger';
// Constants
import {db} from '@services/db/TransactionFunctions';

export const getTimestampForRow = async (
  tableName: string,
  timestampField: string,
  uuid: string,
): Promise<string | null> => {
  try {
    const results = await executeSqlBatch([
      {
        sqlStatement: getRowByIdQuery(tableName, uuid),
        params: [],
      },
    ]);

    if (results.length > 0 && !results[0].error) {
      const result = results[0].result;
      if (result.rows.length > 0) {
        const timestamp: string = result.rows.item(0)[timestampField];
        return timestamp;
      }
    }
    // If the row is not found or an error occurred, resolve with null.
    return null;
  } catch (error) {
    // If there is an issue fetching the timestamp, reject with an error.
    logger.error('Error fetching timestamp: ', error);
    throw error;
  }
};

export const deleteDB = (): void => {
  logger.info('Deleting DB tables. Hold on tight!');
  db.transaction(async (tx: Transaction) => {
    try {
      const results = await executeSqlBatch([
        {
          sqlStatement: generateDeletionQuery,
          params: [],
        },
      ]);

      results.forEach(result => {
        if (!result.error) {
          const rows = result.result.rows;
          for (let i = 0; i < rows.length; i++) {
            const dropSql = Object.values(rows.item(i))[0];
            tx.executeSql(
              dropSql as string,
              [],
              () => {
                logger.info(`Query '${dropSql}' successful`);
              },
              () => {},
            );
          }
        } else {
          logger.error(`Error fetching deletion queries: ${result.error}`);
        }
      });
    } catch (error) {
      logger.error('Error during deletion:', error);
    }
  });
};
