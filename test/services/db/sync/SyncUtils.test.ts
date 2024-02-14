// Test Objects
import {sampleStat} from '../../../Objects';
import {
  sampleCreatedAtTimestamp,
  sampleSyncStartTimestamp,
  sampleUpdatedAtTimestamp,
} from './Objects';
// Functions
import {
  convertListToSyncUpdateSchemas,
  getLastSyncedForTable,
  getRowsToSyncPush,
  insertSyncUpdate,
  getQueryObjForTable,
  filterRowsForInsertion,
} from '@services/db/sync/SyncUtils';

// Types
import {syncDbTables, otherDbTables} from '@shared/Constants';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import * as DbTransactionFunctions from '@services/db/TransactionFunctions';
import * as SyncQueries from '@services/db/sync/Queries';
import {timestampFields} from '@shared/Constants';

// Constants
import {unixEpoch} from '@shared/Constants';
import {SyncCreateSchemas} from '@services/db/sync/Types';

// Global Mocks

jest.mock('@services/db/Utils', () => ({
  runSqlSelect: jest.fn(),
  executeSqlNonQuery: jest.fn(),
}));

jest.mock('@services/db/sync/Queries', () => ({
  ...jest.requireActual('@services/db/sync/Queries'),
  getRowsToSyncPushQuery: jest.fn(),
  getLastSyncedForTableQuery: jest.fn(),
}));

const getLastSyncedForTableQueryCreateRow = {
  last_synced: sampleCreatedAtTimestamp,
  sync_operation: SyncOperation.Creates,
};
const getLastSyncedForTableQueryUpdateRow = {
  last_synced: sampleCreatedAtTimestamp,
  sync_operation: SyncOperation.Updates,
};

const fakeSql = 'fakeSql';

describe('Sync Utils Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getLastSyncedForTable creates only previously synced', async () => {
    // Arrange
    jest
      .spyOn(SyncQueries, 'getLastSyncedForTableQuery')
      .mockReturnValueOnce(fakeSql);

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {sqlStatement: fakeSql},
          result: [getLastSyncedForTableQueryCreateRow],
        },
      ]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {sqlStatement: fakeSql},
    ]);

    expect(response).toEqual({
      [timestampFields.createdAt]:
        getLastSyncedForTableQueryCreateRow.last_synced,
      [timestampFields.updatedAt]: unixEpoch,
    });
  });

  test('getLastSyncedForTable updates only previously synced', async () => {
    // Arrange
    jest
      .spyOn(SyncQueries, 'getLastSyncedForTableQuery')
      .mockReturnValueOnce(fakeSql);

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {sqlStatement: fakeSql},
          result: [getLastSyncedForTableQueryUpdateRow],
        },
      ]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {sqlStatement: fakeSql},
    ]);

    expect(response).toEqual({
      [timestampFields.updatedAt]:
        getLastSyncedForTableQueryUpdateRow.last_synced,
      [timestampFields.createdAt]: unixEpoch,
    });
  });

  test('getLastSyncedForTable updates and creates previously synced', async () => {
    // Arrange
    jest
      .spyOn(SyncQueries, 'getLastSyncedForTableQuery')
      .mockReturnValueOnce(fakeSql);

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: fakeSql,
          },
          result: [
            getLastSyncedForTableQueryUpdateRow,
            getLastSyncedForTableQueryCreateRow,
          ],
        },
      ]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {sqlStatement: fakeSql},
    ]);

    expect(response).toEqual({
      [timestampFields.updatedAt]:
        getLastSyncedForTableQueryUpdateRow.last_synced,
      [timestampFields.createdAt]:
        getLastSyncedForTableQueryCreateRow.last_synced,
    });
  });

  test('getLastSyncedForTable neither updates or creates previously synced', async () => {
    // Arrange
    jest
      .spyOn(SyncQueries, 'getLastSyncedForTableQuery')
      .mockReturnValueOnce(fakeSql);

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: fakeSql,
          },
          result: [],
        },
      ]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getLastSyncedForTableQuery).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {sqlStatement: fakeSql},
    ]);

    expect(response).toEqual({
      [timestampFields.updatedAt]: unixEpoch,
      [timestampFields.createdAt]: unixEpoch,
    });
  });

  test('getRowsToSyncPush uses correct arguements and returns correct response', async () => {
    // Arrange
    const params = [1, 2, 3];
    jest
      .spyOn(SyncQueries, 'getRowsToSyncPushQuery')
      .mockReturnValueOnce(fakeSql);
    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: fakeSql,
          },
          result: params,
        },
      ]);

    // Act
    const response = await getRowsToSyncPush(
      syncDbTables.bodyStatTable,
      SyncOperation.Creates,
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncQueries.getRowsToSyncPushQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getRowsToSyncPushQuery).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncOperation.Creates,
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      sampleSyncStartTimestamp,
    );

    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: fakeSql,
      },
    ]);

    expect(response).toEqual(params);
  });

  test('insertSyncUpdate calls correct query', async () => {
    // Arrange
    const sqlStatement = `INSERT OR REPLACE INTO ${otherDbTables.syncTable} ('table_name', 'last_synced', 'sync_type', 'sync_operation') VALUES (?, ?, ?, ?);`;
    const params = [
      syncDbTables.bodyStatTable,
      sampleCreatedAtTimestamp,
      SyncType.Push,
      SyncOperation.Creates,
    ];

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: '',
          },
          result: [],
        },
      ]);
    // Act
    const response = await insertSyncUpdate({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleCreatedAtTimestamp,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
    // Assert
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: params,
      },
    ]);
    expect(response).toEqual(undefined);
  });

  test('convertListToSyncUpdateSchemas removes create only fields from updates', () => {
    // Arrange
    const {created_at, timezone, ...rest} = sampleStat;
    created_at;
    timezone;
    // Act
    const response = convertListToSyncUpdateSchemas([sampleStat]);
    // Assert
    expect(response).toEqual([rest]);
  });

  test(`getQueryObjForTable SyncOperation ${SyncOperation.Creates}`, () => {
    // Arrange
    // Act
    const response = getQueryObjForTable(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );
    // Assert
    expect(response).toEqual({
      filters: {
        and: {
          [timestampFields.createdAt]: {
            gt: sampleCreatedAtTimestamp,
            le: sampleSyncStartTimestamp,
          },
        },
      },
      sort: [`${timestampFields.createdAt}:asc`],
    });
  });

  test(`getQueryObjForTable SyncOperation ${SyncOperation.Updates}`, () => {
    // Arrange
    // Act
    const response = getQueryObjForTable(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );
    // Assert
    expect(response).toEqual({
      filters: {
        and: {
          [timestampFields.updatedAt]: {
            gt: sampleUpdatedAtTimestamp,
            le: sampleSyncStartTimestamp,
          },
          [timestampFields.createdAt]: {
            le: sampleCreatedAtTimestamp,
          },
        },
      },
      sort: [`${timestampFields.updatedAt}:asc`],
    });
  });

  test(`filterRowsForInsertion correctly filters single existing row`, async () => {
    // Arrange
    const idColumn: string = 'body_stat_id';
    const bodyStatIdToExclude: string = '67f6127d-13cc-4c27-b91f-2b1f83c48eec';
    const sampleStatToExclude: SyncCreateSchemas = {
      ...sampleStat,
      [idColumn]: bodyStatIdToExclude,
    };
    const sqlStatement = `SELECT ${idColumn} FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} IN (?, ?)`;
    const params = [sampleStat.body_stat_id, sampleStatToExclude.body_stat_id];

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: sqlStatement,
            params: params,
          },
          result: [{[idColumn]: bodyStatIdToExclude}],
        },
      ]);

    // Act
    const response = await filterRowsForInsertion(syncDbTables.bodyStatTable, [
      sampleStat,
      sampleStatToExclude,
    ]);

    // Assert
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {sqlStatement: sqlStatement, params: params},
    ]);
    expect(response).toEqual([sampleStat]);
  });

  test(`filterRowsForInsertion correctly filters both existing rows`, async () => {
    // Arrange
    const idColumn: string = 'body_stat_id';
    const bodyStatIdToExclude: string = '67f6127d-13cc-4c27-b91f-2b1f83c48eec';
    const sampleStatToExclude: SyncCreateSchemas = {
      ...sampleStat,
      [idColumn]: bodyStatIdToExclude,
    };
    const sqlStatement = `SELECT ${idColumn} FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} IN (?, ?)`;
    const params = [sampleStat.body_stat_id, sampleStatToExclude.body_stat_id];

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: sqlStatement,
            params: params,
          },
          result: [
            {[idColumn]: bodyStatIdToExclude},
            {[idColumn]: sampleStat.body_stat_id},
          ],
        },
      ]);

    // Act
    const response = await filterRowsForInsertion(syncDbTables.bodyStatTable, [
      sampleStat,
      sampleStatToExclude,
    ]);

    // Assert
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: params,
      },
    ]);

    expect(response).toEqual([]);
  });

  test(`filterRowsForInsertion correctly no existing rows to filter`, async () => {
    // Arrange
    const idColumn: string = 'body_stat_id';
    const sqlStatement = `SELECT ${idColumn} FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} IN (?)`;
    const params = [sampleStat.body_stat_id];

    jest
      .spyOn(DbTransactionFunctions, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: sqlStatement,
            params: params,
          },
          result: [],
        },
      ]);

    // Act
    const response = await filterRowsForInsertion(syncDbTables.bodyStatTable, [
      sampleStat,
    ]);

    // Assert
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(DbTransactionFunctions.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: params,
      },
    ]);

    expect(response).toEqual([sampleStat]);
  });
});
