// Test Objects
import {sampleStat, sampleUpdatedStat} from '../../../Objects';
import {
  TableFunctionsMock,
  postBodyStatSpy,
  createCreateSpy,
  updateUpdateSpy,
} from './Objects';

// Constants
import {syncDbTables} from '@shared/Constants';

// Types
import {SyncCreateSchemas} from '@services/db/sync/Types';
import {SyncType, SyncOperation} from '@shared/Enums';

// Functions
import {
  processUpdatesSyncTypePush,
  processCreatesSyncTypePush,
} from '@services/db/sync/SyncOperations';
import * as SyncUtilFunctions from '@services/db/sync/Functions';
import * as AsyncStorageFunctions from '@services/asyncStorage/Functions';

jest.mock('@services/db/sync/SyncUtils', () => ({
  ...jest.requireActual('@services/db/sync/SyncUtils'),
  insertSyncUpdate: jest.fn(),
  convertListToSyncUpdateSchemas: jest.fn(),
}));

jest.mock('@services/asyncStorage/Functions', () => ({
  ...jest.requireActual('@services/asyncStorage/Functions'),
  getFailedSyncPushesUpdatesForTable: jest.fn(),
  getFailedSyncPushesCreatesForTable: jest.fn(),
  storeFailedSyncPushErrors: jest.fn(),
}));

describe('Sync Operation Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('processUpdatesSyncTypePush with one valid row', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    updateUpdateSpy.mockResolvedValueOnce({status: 204});

    jest
      .spyOn(SyncUtilFunctions, 'convertListToSyncUpdateSchemas')
      .mockReturnValueOnce([sampleUpdatedStat]);
    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesUpdatesForTable')
      .mockResolvedValueOnce([]);

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledTimes(1);
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledWith(rowsToSync);

    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(createCreateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(updateUpdateSpy).toHaveBeenCalledTimes(1);
    expect(updateUpdateSpy).toHaveBeenNthCalledWith(1, sampleUpdatedStat, {
      isSync: true,
    });

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleUpdatedStat.updated_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(0);
  });

  test('processUpdatesSyncTypePush with one valid row and previously failed row', async () => {
    // Arrange

    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    const failedTimeStamp: string = '2025-01-01T00:01:00.666';
    const failedStatUpdate = {
      ...sampleUpdatedStat,
      updated_at: failedTimeStamp,
    };
    updateUpdateSpy
      .mockResolvedValueOnce({status: 204})
      .mockResolvedValueOnce({status: 204});

    jest
      .spyOn(SyncUtilFunctions, 'convertListToSyncUpdateSchemas')
      .mockReturnValueOnce([sampleUpdatedStat]);

    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesUpdatesForTable')
      .mockResolvedValueOnce([failedStatUpdate]);

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledTimes(1);
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledWith(rowsToSync);

    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(createCreateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(updateUpdateSpy).toHaveBeenCalledTimes(2);
    expect(updateUpdateSpy).toHaveBeenNthCalledWith(1, failedStatUpdate, {
      isSync: true,
    });
    expect(updateUpdateSpy).toHaveBeenNthCalledWith(2, sampleUpdatedStat, {
      isSync: true,
    });

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleUpdatedStat.updated_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(0);
  });

  test('processUpdatesSyncTypePush Update receives invalid status code', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    updateUpdateSpy.mockResolvedValueOnce({status: 500});

    jest
      .spyOn(SyncUtilFunctions, 'convertListToSyncUpdateSchemas')
      .mockReturnValueOnce([sampleUpdatedStat]);

    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesUpdatesForTable')
      .mockResolvedValueOnce([]);

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledTimes(1);
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledWith(rowsToSync);

    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(createCreateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(updateUpdateSpy).toHaveBeenCalledTimes(1);
    expect(updateUpdateSpy).toHaveBeenNthCalledWith(1, sampleUpdatedStat, {
      isSync: true,
    });

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleUpdatedStat.updated_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenNthCalledWith(
      1,
      syncDbTables.bodyStatTable,
      SyncOperation.Updates,
      [sampleUpdatedStat],
    );
  });

  test('processUpdatesSyncTypePush no rows', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [];
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;

    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesUpdatesForTable')
      .mockResolvedValueOnce([]);

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      SyncUtilFunctions.convertListToSyncUpdateSchemas,
    ).toHaveBeenCalledTimes(0);

    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledWith(syncDbTables.bodyStatTable);

    expect(createCreateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(updateUpdateSpy).toHaveBeenCalledTimes(0);

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(0);

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(0);
  });

  test('processCreatesSyncTypePush with one valid row', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    createCreateSpy.mockResolvedValueOnce({status: 201});

    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesCreatesForTable')
      .mockResolvedValueOnce([]);

    // Act
    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(updateUpdateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(createCreateSpy).toHaveBeenCalledTimes(1);
    expect(createCreateSpy).toHaveBeenNthCalledWith(1, sampleStat, {
      isSync: true,
    });

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.created_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(0);
  });

  test('processCreatesSyncTypePush with one valid row and previously failed row', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const failedTimeStamp: string = '2025-01-01T00:01:00.777';
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    const failedStatCreate = {
      ...sampleStat,
      created_at: failedTimeStamp,
    };
    createCreateSpy
      .mockResolvedValueOnce({status: 201})
      .mockResolvedValueOnce({status: 201});

    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesCreatesForTable')
      .mockResolvedValueOnce([failedStatCreate]);

    // Act
    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(updateUpdateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(createCreateSpy).toHaveBeenCalledTimes(2);
    expect(createCreateSpy).toHaveBeenNthCalledWith(1, failedStatCreate, {
      isSync: true,
    });
    expect(createCreateSpy).toHaveBeenNthCalledWith(2, sampleStat, {
      isSync: true,
    });

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.created_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(0);
  });

  test('processCreatesSyncTypePush with invalid status code for second row', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const failedTimeStamp: string = '2025-01-01T00:01:00.777';
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    const failedStatCreate = {
      ...sampleStat,
      created_at: failedTimeStamp,
    };
    createCreateSpy
      .mockResolvedValueOnce({status: 201})
      .mockResolvedValueOnce({status: 500});

    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesCreatesForTable')
      .mockResolvedValueOnce([failedStatCreate]);

    // Act
    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      TableFunctionsMock,
    );

    // Assert
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(updateUpdateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(createCreateSpy).toHaveBeenCalledTimes(2);
    expect(createCreateSpy).toHaveBeenNthCalledWith(1, failedStatCreate, {
      isSync: true,
    });
    expect(createCreateSpy).toHaveBeenNthCalledWith(2, sampleStat, {
      isSync: true,
    });

    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.created_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });

    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledWith(syncDbTables.bodyStatTable, SyncOperation.Creates, [
      sampleStat,
    ]);
  });

  test('processCreatesSyncTypePush no rows to sync', async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest
      .spyOn(AsyncStorageFunctions, 'getFailedSyncPushesCreatesForTable')
      .mockResolvedValueOnce([]);

    // Act
    await processCreatesSyncTypePush([], tableToSync, TableFunctionsMock);

    // Assert
    expect(
      AsyncStorageFunctions.getFailedSyncPushesUpdatesForTable,
    ).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledTimes(1);
    expect(
      AsyncStorageFunctions.getFailedSyncPushesCreatesForTable,
    ).toHaveBeenCalledWith(tableToSync);

    expect(updateUpdateSpy).toHaveBeenCalledTimes(0);
    expect(postBodyStatSpy).toHaveBeenCalledTimes(0);
    expect(createCreateSpy).toHaveBeenCalledTimes(0);
    expect(SyncUtilFunctions.insertSyncUpdate).toHaveBeenCalledTimes(0);
    expect(
      AsyncStorageFunctions.storeFailedSyncPushErrors,
    ).toHaveBeenCalledTimes(0);
  });
});
