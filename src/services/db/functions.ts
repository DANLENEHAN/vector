import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
  SQLError,
} from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

// Types
import {alembicTable, RevisionCallback} from './types';
import {DB_NAME, RowData} from './types';

// Fucntions
import {revisionObject} from './vectorRevisions';
import {getAllTables} from './queries/other';

const getDocumentDirectoryPath = () => {
  try {
    const documentDirectoryPath = RNFS.DocumentDirectoryPath;
    console.log('Document Directory Path:', documentDirectoryPath);
  } catch (error) {
    console.error('Error getting document directory path:', error);
  }
};

export const db: SQLiteDatabase = SQLite.openDatabase(
  {name: DB_NAME},
  getDocumentDirectoryPath,
  (error: SQLError) => {
    console.error('Error opening database:', error);
  },
);

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

export const insertRows = async (tableName: string, data: RowData[]) => {
  if (data.length === 0) {
    console.warn('No data to insert.');
    return;
  }

  const schema = Object.keys(data[0]);

  db.transaction((tx: Transaction) => {
    const columns = schema.join(', ');
    const placeholders = schema.map(() => '?').join(', ');

    const insertValues = data.map(item => schema.map(col => item[col])).flat();

    tx.executeSql(
      `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
      insertValues,
      () => {
        // Success callback
        console.log('Insert successful');
      },
      (_, error: SQLError) => {
        // Error callback
        console.error('Error executing SQL:', error);
      },
    );
  });
};
