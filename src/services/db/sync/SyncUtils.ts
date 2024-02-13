// Typing
import {
  SyncTable,
  SyncCreateSchemas,
  SyncUpdateSchemas,
  LastSyncedTimestamps,
} from './Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {otherDbTables, syncDbTables, timestampFields} from '@shared/Constants';
import {RowData} from '@services/db/Types';

// Functions
import {runSqlSelect, executeSqlNonQuery} from '@services/db/Functions';
import {
  getLastSyncedForTableQuery,
  getRowsToSyncPushQuery,
} from '@services/db/sync/Queries';

// Constants
import {unixEpoch} from '@shared/Constants';

/**
 * Retrieves the last synced timestamps for the specified table and synchronization type.
 *
 * @param {syncDbTables} tableName - The name of the table to retrieve last synced timestamps for.
 * @param {SyncType} syncType - The type of synchronization (e.g., 'pull', 'push').
 * @returns {Promise<LastSyncedTimestamps>} A Promise that resolves with an object containing the last synced timestamps.
 */
export const getLastSyncedForTable = async (
  tableName: syncDbTables,
  syncType: SyncType,
): Promise<LastSyncedTimestamps> => {
  const response: RowData[] = await runSqlSelect(
    getLastSyncedForTableQuery(tableName, syncType),
    [],
  );

  let lastCreatedAt: string = unixEpoch;
  let lastUpdatedAt: string = unixEpoch;
  for (let row of response) {
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
 * Retrieve rows to be synchronized for a specific table and Sync operation.
 *
 * @param {string} tableName - The name of the table to retrieve rows for synchronization.
 * @param {SyncOperation} syncOperation - The synchronization operation (e.g., Creates, Updates).
 * @param {string | null} lastSyncTime - Optional timestamp to filter rows updated since the last sync.
 * @returns {Promise<(SyncCreateSchemas | SyncUpdateSchemas)[]>} A promise that resolves to an array
 *   of schemas representing rows to be synchronized.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const getRowsToSyncPush = async (
  tableName: syncDbTables,
  syncOperation: SyncOperation,
  lastSyncedCreates: string,
  lastSyncedUpdates: string,
  syncStart: string,
): Promise<SyncCreateSchemas[]> => {
  return await runSqlSelect(
    getRowsToSyncPushQuery(
      tableName,
      syncOperation,
      lastSyncedCreates,
      lastSyncedUpdates,
      syncStart,
    ),
    [],
  );
};

/**
 * Insert or replace a synchronization update record into the sync table.
 *
 * @param {SyncTable} syncUpdate - The synchronization update to be inserted or replaced.
 * @returns {Promise<void>} A promise that resolves when the insertion or replacement is successful.
 * @throws {Error} If there is an issue with the database transaction, SQL execution, or logging.
 */
export const insertSyncUpdate = async (
  syncUpdate: SyncTable,
): Promise<void> => {
  const columns = `(${Object.keys(syncUpdate)
    .map(key => `'${key}'`)
    .join(', ')})`;
  const insertValues = `(${Object.keys(syncUpdate)
    .map(() => '?')
    .join(', ')})`;

  const response: number = await executeSqlNonQuery(
    `INSERT OR REPLACE INTO ${otherDbTables.syncTable} ${columns} VALUES ${insertValues};`,
    Object.values(syncUpdate),
  );
  if (response !== 1) {
    throw new Error(
      `Failed to insert or replace SyncUpdate. No ${response} rows affected.`,
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
 * Filters out rows from the given array that already exist in the database table based on their unique identifiers.
 *
 * @param {string} tableName - The name of the database table to check for existing rows.
 * @param {SyncCreateSchemas[]} rowsToSync - The array of rows to be filtered.
 * @returns {Promise<SyncCreateSchemas[]>} A Promise that resolves with the array of rows that need to be inserted into the database.
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
  const existingUuids: RowData[] = await runSqlSelect(
    `SELECT ${table_id_field} FROM ${tableName} WHERE ${table_id_field} IN (${placeholders})`,
    tableUuids,
  );

  // Extract UUIDs from the fetched rows
  const existingUuidList = existingUuids.map(
    item => item[table_id_field as keyof (typeof existingUuids)[0]],
  );

  // Filter out rows that already exist in the database
  const rowsToInsert = rowsToSync.filter(
    item =>
      !existingUuidList.includes(
        item[table_id_field as keyof (typeof rowsToSync)[0]],
      ),
  );

  return rowsToInsert;
};
