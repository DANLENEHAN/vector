// Services
import logger from '@utils/Logger';
import SQLite, {SQLiteDatabase, SQLError} from 'react-native-sqlite-storage';
// Functions
import {getDocumentDirectoryPath} from '@shared/Functions';
// Functions
import {runDbMigrationProcess} from '@services/db/alembic/Functions';
// Constants
import {revisionObject} from '@services/db/alembic/VectorRevisions';

export default class DbConnectionManager {
  database: SQLiteDatabase | null = null;

  constructor() {}

  async openDatabase(userId: string) {
    const name: string = `vector.${userId}.db`;
    this.database = SQLite.openDatabase(
      {name: name},
      () => {
        logger.info(`(name)=(${name}) - Database Successfully opened`);
        getDocumentDirectoryPath();
      },
      (error: SQLError) => {
        // Error callback: Log database opening error
        logger.error('Error opening database:', error);
      },
    );
    if (this.database) {
      await runDbMigrationProcess(revisionObject);
    }
  }

  getDB(): SQLiteDatabase | null {
    return this.database;
  }
}
