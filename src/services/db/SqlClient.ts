import {Transaction, ResultSet} from 'react-native-sqlite-storage';
// Types
import 'react-native-get-random-values';
import {ExecutionResult, SqlQuery} from '@services/db/Types';
// Services
import DbConnectionManager from './DbConnectionManager';
import logger from '@utils/Logger';

export const dbConnectionManager = new DbConnectionManager();

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
  if (dbConnectionManager.database === null) {
    logger.error('Critical Error - No database connection found');
    return Promise.reject();
  }
  return new Promise(resolve => {
    const executionResults: ExecutionResult<T>[] = [];
    dbConnectionManager.database!.transaction((tx: Transaction) => {
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
