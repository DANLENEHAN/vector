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
import * as DbFunctions from '@services/db/Functions';
import * as SyncQueries from '@services/db/sync/Queries';
import {timestampFields} from '@shared/Constants';

// Constants
import {unixEpoch} from '@shared/Constants';
import {SyncCreateSchemas} from '@services/db/sync/Types';

// Global Mocks

jest.mock('@services/db/Functions', () => ({
  runSqlSelect: jest.fn(),
  executeSqlNonQuery: jest.fn(),
}));

jest.mock('@services/db/sync/Queries', () => ({
  ...jest.requireActual('@services/db/sync/Queries'),
  getRowsToSyncPushQuery: jest.fn(),
}));

const getLastSyncedForTableQueryCreateRow = {
  last_synced: sampleCreatedAtTimestamp,
  sync_operation: SyncOperation.Creates,
};
const getLastSyncedForTableQueryUpdateRow = {
  last_synced: sampleCreatedAtTimestamp,
  sync_operation: SyncOperation.Updates,
};

describe('Sync Utils Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getLastSyncedForTable creates only previously synced', async () => {
    // Arrange
    jest
      .spyOn(DbFunctions, 'runSqlSelect')
      .mockResolvedValueOnce([getLastSyncedForTableQueryCreateRow]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(response).toEqual({
      [timestampFields.createdAt]:
        getLastSyncedForTableQueryCreateRow.last_synced,
      [timestampFields.updatedAt]: unixEpoch,
    });
  });

  test('getLastSyncedForTable updates only previously synced', async () => {
    // Arrange
    jest
      .spyOn(DbFunctions, 'runSqlSelect')
      .mockResolvedValueOnce([getLastSyncedForTableQueryUpdateRow]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(response).toEqual({
      [timestampFields.updatedAt]:
        getLastSyncedForTableQueryUpdateRow.last_synced,
      [timestampFields.createdAt]: unixEpoch,
    });
  });

  test('getLastSyncedForTable updates and creates previously synced', async () => {
    // Arrange
    jest
      .spyOn(DbFunctions, 'runSqlSelect')
      .mockResolvedValueOnce([
        getLastSyncedForTableQueryUpdateRow,
        getLastSyncedForTableQueryCreateRow,
      ]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(response).toEqual({
      [timestampFields.updatedAt]:
        getLastSyncedForTableQueryUpdateRow.last_synced,
      [timestampFields.createdAt]:
        getLastSyncedForTableQueryCreateRow.last_synced,
    });
  });

  test('getLastSyncedForTable neither updates or creates previously synced', async () => {
    // Arrange
    jest.spyOn(DbFunctions, 'runSqlSelect').mockResolvedValueOnce([]);

    // Act
    const response = await getLastSyncedForTable(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    // Assert
    expect(response).toEqual({
      [timestampFields.updatedAt]: unixEpoch,
      [timestampFields.createdAt]: unixEpoch,
    });
  });

  test('getRowsToSyncPush uses correct arguements and returns correct response', async () => {
    // Arrange
    jest.spyOn(DbFunctions, 'runSqlSelect').mockResolvedValueOnce([1, 2, 3]);
    jest
      .spyOn(SyncQueries, 'getRowsToSyncPushQuery')
      .mockReturnValueOnce('fakeSQL');

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

    expect(DbFunctions.runSqlSelect).toHaveBeenCalledTimes(1);
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledWith('fakeSQL', []);

    expect(response).toEqual([1, 2, 3]);
  });

  test('insertSyncUpdate calls correct query', async () => {
    // Arrange
    jest.spyOn(DbFunctions, 'executeSqlNonQuery').mockResolvedValueOnce(1);
    // Act
    const response = await insertSyncUpdate({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleCreatedAtTimestamp,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
    // Assert
    expect(DbFunctions.executeSqlNonQuery).toHaveBeenCalledTimes(1);
    expect(DbFunctions.executeSqlNonQuery).toHaveBeenCalledWith(
      `INSERT OR REPLACE INTO ${otherDbTables.syncTable} ('table_name', 'last_synced', 'sync_type', 'sync_operation') VALUES (?, ?, ?, ?);`,
      [
        syncDbTables.bodyStatTable,
        sampleCreatedAtTimestamp,
        SyncType.Push,
        SyncOperation.Creates,
      ],
    );
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
    jest
      .spyOn(DbFunctions, 'runSqlSelect')
      .mockResolvedValueOnce([{[idColumn]: bodyStatIdToExclude}]);

    // Act
    const response = await filterRowsForInsertion(syncDbTables.bodyStatTable, [
      sampleStat,
      sampleStatToExclude,
    ]);

    // Assert
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledTimes(1);
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledWith(
      `SELECT ${idColumn} FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} IN (?, ?)`,
      [sampleStat.body_stat_id, sampleStatToExclude.body_stat_id],
    );
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
    jest
      .spyOn(DbFunctions, 'runSqlSelect')
      .mockResolvedValueOnce([
        {[idColumn]: bodyStatIdToExclude},
        {[idColumn]: sampleStat.body_stat_id},
      ]);

    // Act
    const response = await filterRowsForInsertion(syncDbTables.bodyStatTable, [
      sampleStat,
      sampleStatToExclude,
    ]);

    // Assert
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledTimes(1);
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledWith(
      `SELECT ${idColumn} FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} IN (?, ?)`,
      [sampleStat.body_stat_id, sampleStatToExclude.body_stat_id],
    );
    expect(response).toEqual([]);
  });

  test(`filterRowsForInsertion correctly no existing rows to filter`, async () => {
    // Arrange
    const idColumn: string = 'body_stat_id';
    jest.spyOn(DbFunctions, 'runSqlSelect').mockResolvedValueOnce([]);

    // Act
    const response = await filterRowsForInsertion(syncDbTables.bodyStatTable, [
      sampleStat,
    ]);

    // Assert
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledTimes(1);
    expect(DbFunctions.runSqlSelect).toHaveBeenCalledWith(
      `SELECT ${idColumn} FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} IN (?)`,
      [sampleStat.body_stat_id],
    );
    expect(response).toEqual([sampleStat]);
  });
});
