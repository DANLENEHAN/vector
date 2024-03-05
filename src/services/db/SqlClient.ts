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
 * Initializes and returns an instance of the SQLite database.
 * This function opens the database using the specified database name. Upon successful connection,
 * it prints the location of the devices documents.
 *
 * @type {SQLiteDatabase} db - The SQLite Database instance. This instance allows for executing SQL
 *                              queries, transactions, and interacting with the database.
 *
 * @param {Object} {name: dbName} - Configuration object for the database, where `dbName` is the name
 *                                  of the database file to open or create if it does not exist.
 * @param {Function} successCallback - A callback function prints the location of the Devices document
 *                                     dir for devs to find the local db.
 * @param {Function} errorCallback - A callback function that logs errors encountered during the
 *                                   database opening process.
 */
export const db: SQLiteDatabase = SQLite.openDatabase(
  {name: dbName},
  getDocumentDirectoryPath,
  (error: SQLError) => {
    // Error callback: Log database opening error
    logger.error('Error opening database:', error);
  },
);

/**
 * Executes a batch of SQL queries in a transaction.
 *
 * @param {SqlQuery[]} queries - An array of SQL queries to execute.
 * @returns {Promise<ExecutionResult[]>} A promise that resolves to an array of execution results for each query.
 * @throws {Error} Throws an error if there's a problem executing the SQL queries.
 */
export const executeSqlBatch = <T>(
  queries: SqlQuery[],
): Promise<ExecutionResult<T>[]> => {
  return new Promise(resolve => {
    const executionResults: ExecutionResult<T>[] = [];
    db.transaction((tx: Transaction) => {
      const promises: Promise<void>[] = queries.map(
        ({sqlStatement, params = []}, index) => {
          return new Promise<void>((queryResolve, queryReject) => {
            tx.executeSql(
              sqlStatement,
              params,
              (_, result: ResultSet) => {
                const rows: T[] = [];
                for (let i = 0; i < result.rows.length; i++) {
                  rows.push(result.rows.item(i));
                }
                executionResults[index] = {
                  originalQuery: {
                    sqlStatement: sqlStatement,
                    params: params.length > 0 ? params : undefined,
                  },
                  result: rows,
                  error: null,
                };
                queryResolve();
              },
              (error: any) => {
                executionResults[index] = {
                  originalQuery: {
                    sqlStatement: sqlStatement,
                    params: params.length > 0 ? params : undefined,
                  },
                  error: `Execution failed with error: '${error.message}'`,
                  result: [],
                };
                queryReject();
              },
            );
          });
        },
      );

      Promise.all(promises)
        .then(() => {
          resolve(executionResults);
        })
        .catch(() => {
          resolve(executionResults);
        });
    });
  });
};
