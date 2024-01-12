import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
  SQLError,
} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
// Types
import {alembicTable, RevisionCallback} from '@services/db/types';
import {dbName, RowData} from '@services/db/types';
// Functions
import {revisionObject} from '@services/db/vectorRevisions';
import {generateDeletionQuery} from '@services/db/queries/other';
// Logger
import logger from '@utils/logger';

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
 * It processes revisions and executes corresponding SQL commands.
 *
 * @param revisionId The starting revision ID for migrations. If null, starts from the beginning.
 * @returns {void} This function doesn't return a promise as it operates synchronously.
 *
 * @example
 * // Example usage:
 * const startingRevisionId: string | null = '123';
 * runMigrations(startingRevisionId);
 */
export const runMigrations = (revisionId: string | null): void => {
  try {
    const revisionsToProcess = getKeyValuesStartingFrom(revisionId);
    if (Object.keys(revisionsToProcess).length === 0) {
      logger.info('No revisions to process. Moving on...');
    }
    for (const revisionID_ in revisionsToProcess) {
      const sqlCommands = revisionObject[revisionID_];
      db.transaction((tx: any) => {
        logger.info(`Migration for ${revisionID_} applied successfully`);
        sqlCommands.forEach(sqlCommand => {
          tx.executeSql(
            sqlCommand,
            [],
            () => {},
            (_: any, error: any) => {
              logger.error(`Error executing SQL for ${sqlCommand}:`, error);
            },
          );
        });
      });
    }
  } catch (error) {
    logger.error('Error applying migrations:', error);
  }
};

/**
 * @description Retrieves the current revision ID from the alembic table.
 *
 * @param callback A callback function to handle the retrieved revision ID.
 * @returns {void} This function doesn't return a promise as it operates synchronously.
 *
 * @example
 * // Example usage:
 * getCurrentRevision((revisionId) => {
 *   if (revisionId) {
 *     logger.info('Current revision ID:', revisionId);
 *   } else {
 *     logger.info('No revision ID found. Starting from scratch...');
 *   }
 * });
 */
export const getCurrentRevision = (callback: RevisionCallback): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `SELECT version_num FROM ${alembicTable};`,
      [],
      (_: Transaction, result: ResultSet) => {
        if (result.rows.length > 0) {
          const revision_id: string = result.rows.item(0).version_num;
          callback(revision_id);
        } else {
          logger.error('No revision id found.');
        }
      },
      (_: Transaction, error: SQLError) => {
        logger.info(`Unable to retrieve revision id. Error: ${error}`);
        logger.info('Starting from stratch...');
        callback(null);
      },
    );
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
 * @description Inserts rows into the specified table using the provided data.
 *
 * @param tableName The name of the table where the rows will be inserted.
 * @param data An array of RowData representing the rows to be inserted.
 * @returns {Promise<void>} A promise that resolves when the rows are successfully inserted.
 * @throws {Error} Throws an error with a message if no data is provided for insertion.
 * @throws {SQLError} Throws an error with details if the SQL execution encounters an issue.
 *
 * @example
 * // Example usage:
 * const tableName = 'my_table';
 * const data: RowData[] = [...]; // An array of RowData representing rows
 * await insertRows(tableName, data);
 */
export const insertRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

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
        logger.info(
          `Successfulling inserted ${data.length} row${
            data.length > 1 ? 's' : ''
          } in '${tableName}'.`,
        );
      },
      (_, error: SQLError) => {
        throw error;
      },
    );
  });
};
