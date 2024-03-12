// Test Objects
import {sampleStat} from '../../../Objects';
import {
  sampleCreatedAtTimestamp,
  sampleUpdatedAtTimestamp,
  sampleSyncStartTimestamp,
  getQueryObjForTableSampleResponse,
  TableFunctionsMock,
  postBodyStatSpy,
} from './Objects';

// Functions
import * as SyncUtilsFunctions from '@services/db/sync/Functions';
import {
  processSyncTypePush,
  processSyncTypePull,
} from '@services/db/sync/SyncTypes';
import * as SyncOperationFunctions from '@services/db/sync/SyncOperations';
import * as DbFunctions from '@services/db/Operations';

// Types
import {syncDbTables, unixEpoch} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';

jest.mock('@services/db/sync/SyncOperations', () => ({
  ...jest.requireActual('@services/db/sync/SyncOperations'),
  processCreatesSyncTypePush: jest.fn(),
  processUpdatesSyncTypePush: jest.fn(),
}));

jest.mock('@services/db/sync/Functions', () => ({
  ...jest.requireActual('@services/db/sync/Functions'),
  getLastSyncedForTable: jest.fn(),
  getQueryObjForTable: jest.fn(),
  filterRowsForInsertion: jest.fn(),
  insertSyncUpdate: jest.fn(),
  getRowsToSyncPush: jest.fn(),
}));

jest.mock('@services/db/Operations', () => ({
  ...jest.requireActual('@services/db/Operations'),
  insertRows: jest.fn(),
  updateRows: jest.fn(),
}));

describe('SyncType Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const getLastSyncedForTableNoLastResponse = {
    created_at: unixEpoch,
    updated_at: unixEpoch,
  };

  test(`processSyncTypePull SyncOperation '${SyncOperation.Creates} - no previous sync push`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest
      .spyOn(SyncUtilsFunctions, 'getLastSyncedForTable')
      .mockResolvedValueOnce({
        created_at: sampleCreatedAtTimestamp,
        updated_at: sampleUpdatedAtTimestamp,
      })
      .mockResolvedValueOnce(getLastSyncedForTableNoLastResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockReturnValueOnce(getQueryObjForTableSampleResponse);

    postBodyStatSpy.mockResolvedValue({status: 201, data: [sampleStat]});

    jest
      .spyOn(SyncUtilsFunctions, 'filterRowsForInsertion')
      .mockResolvedValue([sampleStat]);

    // Act
    await processSyncTypePull(
      tableToSync,
      TableFunctionsMock[SyncType.Pull],
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenNthCalledWith(
      1,
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenNthCalledWith(
      2,
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    expect(postBodyStatSpy).toHaveBeenCalledTimes(1);
    expect(postBodyStatSpy).toHaveBeenCalledWith(
      getQueryObjForTableSampleResponse,
    );

    expect(SyncUtilsFunctions.filterRowsForInsertion).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.filterRowsForInsertion).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      [sampleStat],
    );

    expect(DbFunctions.updateRows).toHaveBeenCalledTimes(0);
    expect(DbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(DbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      [sampleStat],
    );

    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenNthCalledWith(1, {
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.created_at,
      sync_type: SyncType.Pull,
      sync_operation: SyncOperation.Creates,
    });
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenNthCalledWith(2, {
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.created_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
  });

  test(`processSyncTypePull SyncOperation '${SyncOperation.Creates} - no rows to sync, no previous sync push`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest
      .spyOn(SyncUtilsFunctions, 'getLastSyncedForTable')
      .mockResolvedValueOnce({
        created_at: sampleCreatedAtTimestamp,
        updated_at: sampleUpdatedAtTimestamp,
      })
      .mockResolvedValueOnce(getLastSyncedForTableNoLastResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockReturnValueOnce(getQueryObjForTableSampleResponse);

    postBodyStatSpy.mockResolvedValue({status: 201, data: []});

    // Act
    await processSyncTypePull(
      tableToSync,
      TableFunctionsMock[SyncType.Pull],
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenNthCalledWith(
      1,
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenNthCalledWith(
      2,
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    expect(postBodyStatSpy).toHaveBeenCalledTimes(1);
    expect(postBodyStatSpy).toHaveBeenCalledWith(
      getQueryObjForTableSampleResponse,
    );

    expect(SyncUtilsFunctions.filterRowsForInsertion).toHaveBeenCalledTimes(0);
    expect(DbFunctions.updateRows).toHaveBeenCalledTimes(0);
    expect(DbFunctions.insertRows).toHaveBeenCalledTimes(0);

    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenNthCalledWith(1, {
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleSyncStartTimestamp,
      sync_type: SyncType.Pull,
      sync_operation: SyncOperation.Creates,
    });
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenNthCalledWith(2, {
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleSyncStartTimestamp,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
    });
  });

  test(`processSyncTypePull SyncOperation '${SyncOperation.Creates} - unexpected status code, no previous sync push`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest
      .spyOn(SyncUtilsFunctions, 'getLastSyncedForTable')
      .mockResolvedValueOnce({
        created_at: sampleCreatedAtTimestamp,
        updated_at: sampleUpdatedAtTimestamp,
      })
      .mockResolvedValueOnce(getLastSyncedForTableNoLastResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockReturnValueOnce(getQueryObjForTableSampleResponse);

    postBodyStatSpy.mockResolvedValue({status: 500});

    // Act
    await processSyncTypePull(
      tableToSync,
      TableFunctionsMock[SyncType.Pull],
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    expect(postBodyStatSpy).toHaveBeenCalledTimes(1);
    expect(postBodyStatSpy).toHaveBeenCalledWith(
      getQueryObjForTableSampleResponse,
    );

    expect(SyncUtilsFunctions.filterRowsForInsertion).toHaveBeenCalledTimes(0);
    expect(DbFunctions.updateRows).toHaveBeenCalledTimes(0);
    expect(DbFunctions.insertRows).toHaveBeenCalledTimes(0);
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledTimes(0);
  });

  test(`processSyncTypePull SyncOperation '${SyncOperation.Updates} - no previous sync push`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest
      .spyOn(SyncUtilsFunctions, 'getLastSyncedForTable')
      .mockResolvedValueOnce({
        created_at: sampleCreatedAtTimestamp,
        updated_at: sampleUpdatedAtTimestamp,
      })
      .mockResolvedValueOnce(getLastSyncedForTableNoLastResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockReturnValueOnce(getQueryObjForTableSampleResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'filterRowsForInsertion')
      .mockResolvedValue([sampleStat]);

    postBodyStatSpy.mockResolvedValue({status: 201, data: [sampleStat]});

    // Act
    await processSyncTypePull(
      tableToSync,
      TableFunctionsMock[SyncType.Pull],
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );

    expect(postBodyStatSpy).toHaveBeenCalledTimes(1);
    expect(postBodyStatSpy).toHaveBeenCalledWith(
      getQueryObjForTableSampleResponse,
    );

    expect(SyncUtilsFunctions.filterRowsForInsertion).toHaveBeenCalledTimes(0);
    expect(DbFunctions.insertRows).toHaveBeenCalledTimes(0);

    expect(DbFunctions.updateRows).toHaveBeenCalledTimes(1);
    expect(DbFunctions.updateRows).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      [sampleStat],
    );

    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.updated_at,
      sync_type: SyncType.Pull,
      sync_operation: SyncOperation.Updates,
    });
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.updated_at,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Updates,
    });
  });

  test(`processSyncTypePull SyncOperation '${SyncOperation.Updates} - there has been a previous push`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest
      .spyOn(SyncUtilsFunctions, 'getLastSyncedForTable')
      .mockResolvedValueOnce({
        created_at: sampleCreatedAtTimestamp,
        updated_at: sampleUpdatedAtTimestamp,
      })
      .mockResolvedValueOnce({
        created_at: sampleCreatedAtTimestamp,
        updated_at: sampleUpdatedAtTimestamp,
      });

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockReturnValueOnce(getQueryObjForTableSampleResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'filterRowsForInsertion')
      .mockResolvedValue([sampleStat]);

    postBodyStatSpy.mockResolvedValue({status: 201, data: [sampleStat]});

    // Act
    await processSyncTypePull(
      tableToSync,
      TableFunctionsMock[SyncType.Pull],
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(2);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Push,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );

    expect(postBodyStatSpy).toHaveBeenCalledTimes(1);
    expect(postBodyStatSpy).toHaveBeenCalledWith(
      getQueryObjForTableSampleResponse,
    );

    expect(SyncUtilsFunctions.filterRowsForInsertion).toHaveBeenCalledTimes(0);
    expect(DbFunctions.insertRows).toHaveBeenCalledTimes(0);

    expect(DbFunctions.updateRows).toHaveBeenCalledTimes(1);
    expect(DbFunctions.updateRows).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      [sampleStat],
    );

    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.updated_at,
      sync_type: SyncType.Pull,
      sync_operation: SyncOperation.Updates,
    });
  });

  test(`processSyncTypePush SyncOperation '${SyncOperation.Creates}`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest.spyOn(SyncUtilsFunctions, 'getLastSyncedForTable').mockResolvedValue({
      created_at: sampleCreatedAtTimestamp,
      updated_at: sampleUpdatedAtTimestamp,
    });

    jest
      .spyOn(SyncUtilsFunctions, 'getRowsToSyncPush')
      .mockResolvedValue([sampleStat]);

    // Act
    await processSyncTypePush(
      tableToSync,
      TableFunctionsMock,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(
      SyncOperationFunctions.processUpdatesSyncTypePush,
    ).toHaveBeenCalledTimes(0);
    expect(
      SyncOperationFunctions.processCreatesSyncTypePush,
    ).toHaveBeenCalledTimes(1);
    expect(
      SyncOperationFunctions.processCreatesSyncTypePush,
    ).toHaveBeenCalledWith(
      [sampleStat],
      syncDbTables.bodyStatTable,
      TableFunctionsMock,
      sampleSyncStartTimestamp,
    );
  });

  test(`processSyncTypePush SyncOperation '${SyncOperation.Updates}`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest.spyOn(SyncUtilsFunctions, 'getLastSyncedForTable').mockResolvedValue({
      created_at: sampleCreatedAtTimestamp,
      updated_at: sampleUpdatedAtTimestamp,
    });

    jest
      .spyOn(SyncUtilsFunctions, 'getRowsToSyncPush')
      .mockResolvedValue([sampleStat]);

    // Act
    await processSyncTypePush(
      tableToSync,
      TableFunctionsMock,
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(
      SyncOperationFunctions.processCreatesSyncTypePush,
    ).toHaveBeenCalledTimes(0);
    expect(
      SyncOperationFunctions.processUpdatesSyncTypePush,
    ).toHaveBeenCalledTimes(1);
    expect(
      SyncOperationFunctions.processUpdatesSyncTypePush,
    ).toHaveBeenCalledWith(
      [sampleStat],
      syncDbTables.bodyStatTable,
      TableFunctionsMock,
      sampleSyncStartTimestamp,
    );
  });
});
