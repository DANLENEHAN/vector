// Typing
import {
  SyncTable,
  SyncCreateSchemas,
  SyncUpdateSchemas,
  LastSyncedTimestamps,
} from '@services/db/sync/Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {otherDbTables, syncDbTables, timestampFields} from '@shared/Constants';
import {RowData, SqlQuery, ExecutionResult} from '@services/db/Types';

// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {
  getLastSyncedForTableQuery,
  getRowsToSyncPushQuery,
} from '@services/db/sync/Queries';

// Constants
import {unixEpoch} from '@shared/Constants';

// Logger
import logger from '@utils/Logger';

/**
 * Retrieves the last synced timestamps for a specified table and sync type.
 *
 * @param {string} tableName - The name of the table to retrieve last synced timestamps for.
 * @param {SyncType} syncType - The type of synchronization (Creates or Updates).
 * @returns {Promise<LastSyncedTimestamps>} A promise that resolves to an object containing the last synced timestamps for the specified table.
 * @throws {Error} Throws an error if there's a problem executing the SQL query.
 */
export const getLastSyncedForTable = async (
  tableName: syncDbTables,
  syncType: SyncType,
): Promise<LastSyncedTimestamps> => {
  const query: SqlQuery = {
    sqlStatement: getLastSyncedForTableQuery(tableName, syncType),
  };

  const executionResult: ExecutionResult[] = await executeSqlBatch([query]);

  if (executionResult[0].error) {
    logger.error('Error executing SQL query:', executionResult[0]?.error);
  }

  const rows: RowData[] = executionResult[0].result;
  let lastCreatedAt: string = unixEpoch;
  let lastUpdatedAt: string = unixEpoch;

  for (const row of rows) {
    if (row.sync_operation === SyncOperation.Creates) {
      lastCreatedAt = row.last_synced;
    } else if (row.sync_operation === SyncOperation.Updates) {
      lastUpdatedAt = row.last_synced;
    }
  }

  return {
    [timestampFields.createdAt]: lastCreatedAt,
    [timestampFields.updatedAt]: lastUpdatedAt,
  };
};

/**
 * Retrieves rows to synchronize for pushing changes to the server.
 *
 * @param {string} tableName - The name of the table to retrieve rows for synchronization.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @param {string} lastSyncedCreates - The timestamp of the last synchronization for create operations.
 * @param {string} lastSyncedUpdates - The timestamp of the last synchronization for update operations.
 * @param {string} syncStart - The timestamp indicating the start of the synchronization period.
 * @returns {Promise<SyncCreateSchemas[]>} A promise that resolves to an array of schemas representing rows to sync push.
 * @throws {Error} Throws an error if there's a problem executing the SQL query.
 */
export const getRowsToSyncPush = async (
  tableName: syncDbTables,
  syncOperation: SyncOperation,
  lastSyncedCreates: string,
  lastSyncedUpdates: string,
  syncStart: string,
): Promise<SyncCreateSchemas[]> => {
  const query: SqlQuery = {
    sqlStatement: getRowsToSyncPushQuery(
      tableName,
      syncOperation,
      lastSyncedCreates,
      lastSyncedUpdates,
      syncStart,
    ),
  };

  const executionResult: any[] = await executeSqlBatch([query]);

  if (executionResult[0].error) {
    logger.error(
      'Error executing getRowsToSyncPush SQL query:',
      executionResult[0].error,
    );
    return [];
  }
  return executionResult[0].result;
};

/**
 * Inserts or replaces a sync update record into the synchronization table.
 *
 * @param {SyncTable} syncUpdate - The sync update object to insert or replace.
 * @returns {Promise<void>} A promise that resolves when the insertion or replacement is completed.
 * @throws {Error} Throws an error if there's a problem executing the SQL query.
 */
export const insertSyncUpdate = async (
  syncUpdate: SyncTable,
): Promise<void> => {
  const columns = Object.keys(syncUpdate)
    .map(key => `'${key}'`)
    .join(', ');
  const insertValues = Object.keys(syncUpdate)
    .map(() => '?')
    .join(', ');

  const query: SqlQuery = {
    sqlStatement: `INSERT OR REPLACE INTO ${otherDbTables.syncTable} (${columns}) VALUES (${insertValues});`,
    params: Object.values(syncUpdate),
  };

  const executionResult: ExecutionResult[] = await executeSqlBatch([query]);

  if (executionResult[0].error) {
    throw new Error(
      `Failed to insert or replace SyncUpdate: ${executionResult[0].error}`,
    );
  }
};

/**
 * Converts an array of SyncCreateSchemas to an array of SyncUpdateSchemas by removing 'created_at' and 'timezone' fields.
 *
 * @param {SyncCreateSchemas[]} createSchemasList - The array of SyncCreateSchemas to be converted.
 * @returns {SyncUpdateSchemas[]} The array of SyncUpdateSchemas.
 */
export function convertListToSyncUpdateSchemas(
  createSchemasList: SyncCreateSchemas[],
): SyncUpdateSchemas[] {
  return createSchemasList.map(createSchema => {
    const {created_at, timezone, ...rest} = createSchema;
    // remove the below at somepoint
    created_at;
    timezone;
    return rest as SyncUpdateSchemas;
  });
}

/**
 * Generates a query object for retrieving data from the database table based on the specified synchronization criteria.
 *
 * @param {string} lastSyncedCreates - The timestamp of the last sync for creations.
 * @param {string} lastSyncedUpdates - The timestamp of the last sync for updates.
 * @param {SyncOperation} syncOperation - The type of synchronization operation (Creates or Updates).
 * @param {string} syncStart - The timestamp representing the start of the synchronization process.
 * @returns {Promise<QuerySchema>} A Promise that resolves with the query object for retrieving data.
 */
export const getQueryObjForTable = (
  lastSyncedCreates: string,
  lastSyncedUpdates: string,
  syncOperation: SyncOperation,
  syncStart: string,
): QuerySchema => {
  const timestampField =
    syncOperation === SyncOperation.Creates
      ? timestampFields.createdAt
      : timestampFields.updatedAt;

  let filter_obj = {};

  if (syncOperation === SyncOperation.Creates) {
    filter_obj = {
      and: {
        // Caputring rows created between the last sync and the
        // the start of this current sync process
        [timestampFields.createdAt]: {
          gt: lastSyncedCreates,
          le: syncStart,
        },
      },
    };
  } else {
    filter_obj = {
      and: {
        // Caputring rows updated between the last sync and the
        // the start of this current sync process
        [timestampFields.updatedAt]: {
          gt: lastSyncedUpdates,
          le: syncStart,
        },
        // Excluding rows that have been created within the timeframe of last sync
        // and the current one as they will already have been pulled.
        [timestampFields.createdAt]: {le: lastSyncedCreates},
      },
    };
  }

  return {
    filters: filter_obj,
    sort: [`${timestampField}:asc`],
  } as QuerySchema;
};

/**
 * Filters rows to synchronize for insertion into the database, removing duplicates.
 *
 * @param {string} tableName - The name of the table to filter rows for insertion.
 * @param {SyncCreateSchemas[]} rowsToSync - An array of schemas representing rows to synchronize.
 * @returns {Promise<SyncCreateSchemas[]>} A promise that resolves to an array of filtered rows ready for insertion.
 * @throws {Error} Throws an error if there's a problem executing the SQL query or filtering the rows.
 */
export const filterRowsForInsertion = async (
  tableName: string,
  rowsToSync: SyncCreateSchemas[],
): Promise<SyncCreateSchemas[]> => {
  // Construct placeholders for SQL query parameters
  const placeholders = rowsToSync.map(() => '?').join(', ');
  // Determine the ID field based on the table name
  const table_id_field = `${tableName}_id`;
  // Extract UUIDs from the rows to sync
  const tableUuids = rowsToSync.map(
    item => item[table_id_field as keyof (typeof rowsToSync)[0]],
  );

  // Fetch existing UUIDs from the database
  const sqlStatement = `SELECT ${table_id_field} FROM ${tableName} WHERE ${table_id_field} IN (${placeholders})`;
  const query: SqlQuery = {
    sqlStatement,
    params: tableUuids,
  };

  const executionResult: ExecutionResult[] = await executeSqlBatch([query]);

  if (executionResult[0].error) {
    throw new Error(
      `Error fetching existing UUIDs from ${tableName}: ${executionResult[0].error}`,
    );
  }

  const existingUuids: string[] = executionResult[0].result.map(
    (item: any) => item[table_id_field],
  );

  // Filter out rows that already exist in the database
  const rowsToInsert = rowsToSync.filter(
    item =>
      !existingUuids.includes(
        item[table_id_field as keyof (typeof rowsToSync)[0]] as string,
      ),
  );

  return rowsToInsert;
};
