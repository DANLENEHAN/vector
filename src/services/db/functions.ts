import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
  SQLError,
} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
// Types
import {alembicTable} from '@services/db/Types';
import {dbName, RowData} from '@services/db/Types';
import {dbTables, timestampFields} from '@shared/Constants';
// Functions
import {revisionObject} from '@services/db/vectorRevisions';
import {generateDeletionQuery} from '@services/db/Queries';
import {getRowByIdQuery} from './sync/Queries';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
// Logger
import logger from '@utils/Logger';

/**
 * @description Retrieves the document directory path using React Native File System (RNFS).
 *
 * @returns {void} This function doesn't return a value; it logs the document directory path.
 *
 * @example
 * // Example usage:
 * getDocumentDirectoryPath();
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
 *
 * @example
 * // Example usage:
 * // Access the database instance using the 'db' constant.
 * db.transaction((tx: Transaction) => {
 *   // Perform transactions or execute SQL commands here.
 * });
 */
export const db: SQLiteDatabase = SQLite.openDatabase(
  {name: dbName},
  getDocumentDirectoryPath,
  (error: SQLError) => {
    logger.error('Error opening database:', error);
  },
);

/**
 * @description Retrieves a subset of revisionObject starting from the specified key.
 *
 * @param startKey The key from which to start retrieving values. If null, retrieves all values.
 * @returns {Object} An object representing key-value pairs from revisionObject starting from the specified key.
 *
 * @example
 * // Example usage:
 * const startingKey: string | null = '123';
 * const subset = getKeyValuesStartingFrom(startingKey);
 */
export const getKeyValuesStartingFrom = (
  startKey: string | null,
): {[key: string]: string[]} => {
  let startKeyFound = false;
  return Object.entries(revisionObject).reduce((result, [key, value]) => {
    if (startKeyFound || startKey === null) {
      result[key] = value;
    }

    if (startKey && key.includes(startKey)) {
      startKeyFound = true;
    }

    return result;
  }, {} as {[key: string]: string[]});
};

/**
 * @description Runs database migrations starting from the specified revision ID.
 * It processes revisions and executes corresponding SQL commands within transactions.
 *
 * @param {string | null} revisionId - The starting revision ID for migrations.
 * If null, the function starts migrations from the beginning.
 *
 * @returns {Promise<void>} A promise that resolves when all migrations are successfully completed.
 *
 * @throws {Error} If an error occurs during the migration process, the promise is rejected with the corresponding error.
 *
 * @example
 * // Example usage:
 * const startingRevisionId: string | null = '123';
 * await runMigrations(startingRevisionId);
 */
export const runMigrations = async (
  revisionId: string | null,
): Promise<void> => {
  try {
    const revisionsToProcess = getKeyValuesStartingFrom(revisionId);

    if (Object.keys(revisionsToProcess).length === 0) {
      logger.info('No revisions to process. Moving on...');
      return Promise.resolve();
    }

    const transactionPromises: Promise<void>[] = [];

    for (const revisionID_ in revisionsToProcess) {
      const sqlCommands = revisionObject[revisionID_];

      const transactionPromise = new Promise<void>((resolve, reject) => {
        db.transaction(
          (tx: any) => {
            logger.info(`Migration for ${revisionID_} applied successfully`);
            const commandPromises: Promise<void>[] = [];

            sqlCommands.forEach(sqlCommand => {
              const commandPromise = new Promise<void>(
                (cmdResolve, cmdReject) => {
                  tx.executeSql(
                    sqlCommand,
                    [],
                    () => cmdResolve(),
                    (error: Transaction) => {
                      logger.error(
                        `Error executing SQL for ${sqlCommand}:`,
                        error,
                      );
                      cmdReject(error);
                    },
                  );
                },
              );

              commandPromises.push(commandPromise);
            });

            Promise.all(commandPromises)
              .then(() => resolve())
              .catch(error => reject(error));
          },
          (error: SQLError) => {
            logger.error(
              `Error starting transaction for ${revisionID_}:`,
              error,
            );
            reject(error);
          },
        );
      });

      transactionPromises.push(transactionPromise);
    }

    await Promise.all(transactionPromises);
  } catch (error) {
    logger.error('Error applying migrations:', error);
    throw error;
  }
};

/**
 * @description Retrieves the current revision ID from the alembic table and triggers
 * database migrations accordingly.
 *
 * @returns {Promise<void>} A promise that resolves when the current revision is retrieved
 * and corresponding migrations are executed successfully.
 *
 * @throws {Error} If an error occurs during the process, the promise is rejected with the
 * corresponding error.
 *
 * @example
 * // Example usage:
 * await runDbMigrationProcess();
 */
export const runDbMigrationProcess = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        `SELECT version_num FROM ${alembicTable};`,
        [],
        async (_: Transaction, result: ResultSet) => {
          if (result.rows.length > 0) {
            const revision_id: string = result.rows.item(0).version_num;
            await runMigrations(revision_id);
            resolve();
          } else {
            logger.error('No revision id found.');
            reject(new Error('No revision id found.'));
          }
        },
        (error: Transaction) => {
          logger.info(`Unable to retrieve revision id. Error: ${error}`);
          logger.info('Starting from scratch...');
          runMigrations(null);
          resolve();
        },
      );
    });
  });
};

/**
 * @description Deletes all tables in the database.
 * This function retrieves all table names, generates DROP TABLE queries, and executes them.
 *
 * @returns {void} This function doesn't return a promise as it operates synchronously.
 *
 * @example
 * // Example usage:
 * deleteDB();
 */
export const deleteDB = (): void => {
  logger.info('Deleting DB tables. Hold on tight!');
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      generateDeletionQuery,
      [],
      (_: Transaction, result: ResultSet) => {
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
          const dropSql = Object.values(rows.item(i))[0];
          tx.executeSql(
            dropSql as string,
            [],
            () => {
              logger.info(`Query '${dropSql}' successfull`);
            },
            () => {},
          );
        }
      },
      (_: Transaction, error: SQLError) => {
        logger.info('Error: ', error);
      },
    );
  });
};

/**
 * Inserts rows into the specified table using the provided data.
 *
 * @param {dbTables} tableName - The name of the table where the rows will be inserted.
 * @param {RowData[]} data - An array of RowData representing the rows to be inserted.
 * @param {boolean} [insert_uuid=true] - Optional parameter to insert UUIDs for each row. Defaults to true.
 * @returns {Promise<void>} A promise that resolves when the rows are successfully inserted.
 * @throws {Error} Throws an error with a message if no data is provided for insertion.
 * @throws {SQLError} Throws an error with details if the SQL execution encounters an issue.
 *
 * @description
 * This function inserts rows into the specified database table using the provided data.
 * Optionally, it can insert UUIDs for each row if the `insert_uuid` parameter is true (default).
 * The function throws an error if no data is provided for insertion or if there is an issue
 * with the SQL execution, providing detailed information in the SQLError.
 *
 * @example
 * // Example usage:
 * const tableName = dbTables.myTable;
 * const data: RowData[] = [...]; // An array of RowData representing rows
 * await insertRows(tableName, data);
 */
export const insertRows = async (
  tableName: dbTables,
  data: RowData[],
  insert_uuid: boolean = true,
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

  // Optionally insert UUIDs for each row.
  if (insert_uuid === true) {
    data = data.map(obj => ({...obj, [`${tableName}_id`]: uuidv4()}));
  }

  return new Promise((resolve, reject) => {
    const schema = Object.keys(data[0]);

    db.transaction((tx: Transaction) => {
      const columns = schema.join(', ');
      const placeholders = data
        .map(
          () =>
            `(${Object.keys(schema)
              .map(() => '?')
              .join(', ')})`,
        )
        .join(', ');
      const insertValues = data.flatMap(value => Object.values(value));

      tx.executeSql(
        `INSERT INTO ${tableName} (${columns}) VALUES ${placeholders}`,
        insertValues,
        () => {
          // Transaction success callback
          logger.info(
            `Successfully inserted ${data.length} row${
              data.length !== 1 ? 's' : ''
            } in '${tableName}'.`,
          );
          resolve(); // Resolve the promise on success
        },
        (error: Transaction) => {
          // Transaction error callback
          logger.error('Error during insertion: ', error);
          reject(error); // Reject the promise on error
          throw error;
        },
      );
    });
  });
};

/**
 * Retrieve the timestamp for a specific row in the specified table.
 *
 * @param {dbTables} tableName - The name of the table.
 * @param {timestampFields} timestampField - The timestamp field to retrieve ('created_at' or 'updated_at').
 * @param {string} uuid - The UUID of the row.
 * @returns {Promise<string | null>} A promise that resolves with the timestamp or null if the row is not found.
 * @throws {Error} Throws an error if there is an issue fetching the timestamp.
 *
 * @description
 * This function retrieves the timestamp for a specific row in the specified database table.
 * It uses the provided UUID to identify the row and the timestampField to determine which
 * timestamp to retrieve ('created_at' or 'updated_at'). The function returns the timestamp
 * if the row is found, otherwise, it resolves with null. It throws an error if there is an issue
 * fetching the timestamp from the database.
 *
 * @example
 * // Example usage:
 * const tableName = dbTables.statTable;
 * const timestampField = timestampFields.updatedAt;
 * const uuid = 'some_uuid';
 * const timestamp: string | null = await getTimestampForRow(tableName, timestampField, uuid);
 */
const getTimestampForRow = async (
  tableName: dbTables,
  timestampField: timestampFields,
  uuid: string,
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        getRowByIdQuery(tableName, uuid),
        [],
        (_: Transaction, result: ResultSet) => {
          if (result.rows.length > 0) {
            const timestamp: string = result.rows.item(0)[timestampField];
            resolve(timestamp);
          } else {
            // If the row is not found, resolve with null.
            resolve(null);
          }
        },
        (error: Transaction) => {
          // If there is an issue fetching the timestamp, reject with an error.
          logger.error('Error fetching timestamp: ', error);
          reject(error);
        },
      );
    });
  });
};

/**
 * Updates rows in the specified table based on the provided data.
 *
 * @param {dbTables} tableName - The name of the table.
 * @param {RowData[]} data - An array of RowData representing the rows to be updated.
 * @returns {Promise<void>} A promise that resolves when the rows are successfully updated.
 * @throws {Error} Throws an error if there is an issue updating the rows.
 *
 * @description
 * This function updates rows in the specified database table based on the provided data.
 * It determines whether to replace a row or skip it based on the timestamp comparison
 * with the existing row in the database.
 *
 * @example
 * // Example usage:
 * const tableName = dbTables.statTable;
 * const data: RowData[] = [...]; // An array of RowData representing rows
 * await updateRows(tableName, data);
 */
export const updateRows = async (
  tableName: dbTables,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    logger.warn('No data to update.');
  }

  let replaceCount = 0;
  const schema = Object.keys(data[0]);

  const columns = schema.join(', ');
  const placeholders = `(${Object.keys(schema)
    .map(() => '?')
    .join(', ')})`;

  const updatePromises: Promise<void>[] = [];

  for (let i = 0; i < data.length; i++) {
    const newRowObject = data[i];
    const rowIdColumn = `${tableName}_id`;
    const rowId = data[i][rowIdColumn];

    const currentRowTimestamp = await getTimestampForRow(
      tableName,
      timestampFields.updatedAt,
      rowId,
    );

    updatePromises.push(
      new Promise<void>((resolve, reject) => {
        db.transaction((tx: Transaction) => {
          if (
            currentRowTimestamp === null ||
            newRowObject[timestampFields.updatedAt] > currentRowTimestamp
          ) {
            tx.executeSql(
              `REPLACE INTO ${tableName} (${columns}) VALUES ${placeholders}`,
              Object.values(newRowObject),
              () => {
                replaceCount++;
                resolve();
              },
              (error: Transaction) => {
                logger.error('Error updating rows: ', error);
                reject(error);
              },
            );
          } else if (
            newRowObject[timestampFields.updatedAt] === currentRowTimestamp
          ) {
            logger.info(
              'Current and pulled row have be updated at the same time doing nothing.',
            );
          } else {
            logger.info(
              `Current row with ${rowIdColumn} = '${rowId}' is more up-to-date than the pulled row...skipping.`,
            );
            resolve();
          }
        });
      }),
    );
  }

  await Promise.all(updatePromises);

  logger.info(
    `Successfully replaced ${replaceCount} row${
      replaceCount !== 1 ? 's' : ''
    } in '${tableName}' out of the ${data.length} pulled in the sync.`,
  );
};

/**
 * Execute a SELECT SQL statement and retrieve the result set.
 *
 * @param {string} sqlStatement - The SELECT SQL statement to be executed.
 * @param {RowData[]} rowData - The data to be passed as parameters to the SQL statement.
 * @returns {Promise<T[]>} A promise that resolves with the result set obtained from the SELECT statement.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const runSqlSelect = <T>(
  sqlStatement: string,
  rowData: RowData[],
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        sqlStatement,
        rowData,
        (_, result: ResultSet) => {
          const rows: T[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          resolve(rows);
        },
        (error: Transaction) => {
          // Include sqlStatement in the error message for better context
          reject(
            new Error(
              `Error executing SELECT SQL statement: ${sqlStatement}. ${error}`,
            ),
          );
        },
      );
    });
  });
};

/**
 * Execute a non-query SQL statement (INSERT, DELETE, REPLACE, or UPDATE) and retrieve the number of affected rows.
 *
 * @param {string} sqlStatement - The non-query SQL statement to be executed.
 * @param {any[]} params - The parameters to be passed to the SQL statement.
 * @returns {Promise<number>} A promise that resolves with the number of affected rows.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const executeSqlNonQuery = (
  sqlStatement: string,
  params: any[] = [],
): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        sqlStatement,
        params,
        (_, result: ResultSet) => {
          // Return the number of affected rows for INSERT, DELETE, REPLACE, UPDATE
          resolve(result.rowsAffected);
        },
        (error: Transaction) => {
          // Include sqlStatement in the error message for better context
          reject(
            new Error(
              `Error executing non-query SQL statement: ${sqlStatement}. ${error}`,
            ),
          );
        },
      );
    });
  });
};
