import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
  SQLError,
} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
// Types
import {dbName} from '@services/db/Types';
import 'react-native-get-random-values';
import {ExecutionResult, SqlQuery} from '@services/db/Types';
// Logger
import logger from '@utils/Logger';

/**
 * @description Retrieves the document directory path using React Native File System (RNFS).
 *
 * @returns {void} This function doesn't return a value; it logs the document directory path.
 */
const getDocumentDirectoryPath = (): void => {
  try {
    const documentDirectoryPath = RNFS.DocumentDirectoryPath;
    logger.info('Document Directory Path:', documentDirectoryPath);
  } catch (error) {
    logger.error('Error getting document directory path:', error);
  }
};

/**
 * @description Represents the SQLite database instance.
 *
 * @type {SQLiteDatabase}
 */
export const db: SQLiteDatabase = SQLite.openDatabase(
  {name: dbName},
  getDocumentDirectoryPath,
  (error: SQLError) => {
    logger.error('Error opening database:', error);
  },
);

export const executeSqlBatch = (
  queries: SqlQuery[],
): Promise<ExecutionResult<any>[]> => {
  return new Promise(resolve => {
    db.transaction((tx: Transaction) => {
      const promises: Promise<ResultSet>[] = queries.map(
        ({sqlStatement, params = []}) => {
          return new Promise<ResultSet>((queryResolve, queryReject) => {
            tx.executeSql(
              sqlStatement,
              params,
              (_, result: ResultSet) => {
                queryResolve(result);
              },
              (error: Transaction) => {
                queryReject(error);
              },
            );
          });
        },
      );

      Promise.all(promises)
        .then(results => {
          const executionResults: ExecutionResult<any>[] = [];
          results.forEach((result, index) => {
            const {sqlStatement, params} = queries[index];
            const rows: any[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              rows.push(result.rows.item(i));
            }
            executionResults.push({
              originalQuery: {sqlStatement, params},
              result: rows,
            });
          });
          resolve(executionResults);
        })
        .catch(error => {
          const executionResults: ExecutionResult<any>[] = queries.map(
            ({sqlStatement, params}) => {
              return {
                originalQuery: {sqlStatement, params},
                error: `Execution failed with error: '${error.message}'`,
              };
            },
          );
          resolve(executionResults);
        });
    });
  });
};
