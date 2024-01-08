import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
} from 'react-native-sqlite-storage';

import {revisionObject} from './vectorRevisions';
import {alembicTable, RevisionCallback} from './types';
import {revisionID} from '../db/revisions/05012024144706670337_5f3ef40a3082';

export const db: SQLiteDatabase = SQLite.openDatabase(
  {name: 'your_database_name.db'},
  () => {},
  (_: any, error: any) => {
    console.error('Error opening database:', error);
  },
);

export const getKeyValuesStartingFrom = (
  startKey: string,
): {[key: string]: string[]} => {
  let startKeyFound = false;
  console.log(`Looking for revisions after id '${startKey}'`);
  return Object.entries(revisionObject).reduce((result, [key, value]) => {
    if (startKeyFound) {
      result[key] = value;
    }

    if (key.includes(startKey)) {
      startKeyFound = true;
    }

    return result;
  }, {});
};

export const runMigrations = (revisionId: string) => {
  try {
    const revisionsToProcess = getKeyValuesStartingFrom(revisionId);
    if (Object.keys(revisionsToProcess).length === 0) {
      console.log('No revisions to process. Moving on...');
    }
    for (const revisionID in revisionsToProcess) {
      const sqlCommands = revisionObject[revisionID];
      db.transaction((tx: any) => {
        sqlCommands.forEach(sqlCommand => {
          tx.executeSql(
            sqlCommand,
            [],
            () => {
              console.log(`Migration for ${revisionID} applied successfully`);
            },
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
      (tx: Transaction, result: ResultSet) => {
        if (result.rows.length > 0) {
          const revision_id: string = result.rows.item(0).version_num;
          console.log(`Retrieved revision id: ${revision_id}`);
          callback(revision_id);
        } else {
          console.error('No revision id found.');
        }
      },
      (tx: Transaction, error: Error) => {
        console.error(`Unable to retrieve revision id. Error: ${error}`);
        console.log(`Using intial revision id: ${revisionID}`);
        callback(revisionID);
      },
    );
  });
};
