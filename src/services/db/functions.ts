import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
  SQLError,
} from 'react-native-sqlite-storage';

import {revisionObject} from './vectorRevisions';
import {alembicTable, RevisionCallback} from './types';
import {getAllTables} from './queries/other';

export const db: SQLiteDatabase = SQLite.openDatabase(
  {name: 'your_database_name.db'},
  () => {},
  (error: SQLError) => {
    console.error('Error opening database:', error);
  },
);

export const getKeyValuesStartingFrom = (
  startKey: string | null,
): {[key: string]: string[]} => {
  let startKeyFound = false;
  console.log(`Looking for revisions after id '${startKey}'`);
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

export const runMigrations = (revisionId: string | null) => {
  try {
    const revisionsToProcess = getKeyValuesStartingFrom(revisionId);
    if (Object.keys(revisionsToProcess).length === 0) {
      console.log('No revisions to process. Moving on...');
    }
    for (const revisionID_ in revisionsToProcess) {
      const sqlCommands = revisionObject[revisionID_];
      db.transaction((tx: any) => {
        console.log(`Migration for ${revisionID_} applied successfully`);
        sqlCommands.forEach(sqlCommand => {
          tx.executeSql(
            sqlCommand,
            [],
            () => {},
            (_: any, error: any) => {
              console.error(`Error executing SQL for ${sqlCommand}:`, error);
            },
          );
        });
      });
    }
  } catch (error) {
    console.error('Error applying migrations:', error);
  }
};

export const getCurrentRevision = (callback: RevisionCallback) => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `SELECT version_num FROM ${alembicTable};`,
      [],
      (_: Transaction, result: ResultSet) => {
        if (result.rows.length > 0) {
          const revision_id: string = result.rows.item(0).version_num;
          console.log(`Retrieved revision id: ${revision_id}`);
          callback(revision_id);
        } else {
          console.error('No revision id found.');
        }
      },
      (_: Transaction, error: SQLError) => {
        console.log(`Unable to retrieve revision id. Error: ${error}`);
        console.log('Starting from stratch...');
        callback(null);
      },
    );
  });
};

export const deleteDB = () => {
  console.log('Deleting DB tables. Hold on tight!');
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      getAllTables,
      [],
      (_: Transaction, result: ResultSet) => {
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
          const dropSql = Object.values(rows.item(i))[0];
          tx.executeSql(
            dropSql as string,
            [],
            () => {
              console.log(`Query '${dropSql}' successfull`);
            },
            () => {},
          );
        }
      },
      (_: Transaction, error: SQLError) => {
        console.log('Error: ', error);
      },
    );
  });
};
