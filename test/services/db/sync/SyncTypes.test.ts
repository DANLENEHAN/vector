// Test Objects

import {syncDbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';

// Functions
import * as SyncUtilsFunctions from '@services/db/sync/SyncUtils';
import {
  processSyncTypePush,
  processSyncTypePull,
} from '@services/db/sync/SyncTypes';
import * as SyncOperationFunctions from '@services/db/sync/SyncOperations';
import * as DbFunctions from '@services/db/Functions';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';
import {sampleStat} from '../../../Objects';
import {
  sampleCreatedAtTimestamp,
  sampleUpdatedAtTimestamp,
  sampleSyncStartTimestamp,
  getQueryObjForTableSampleResponse,
} from './Objects';
import {SyncCreateSchemas} from '@services/db/sync/Types';
import {SyncTableFunctions} from '@services/db/sync/Types';
import {SyncUpdateSchemas} from '@services/db/sync/Types';

jest.mock('@services/db/sync/SyncOperations', () => ({
  ...jest.requireActual('@services/db/sync/SyncOperations'),
  processCreatesSyncTypePush: jest.fn(),
  processUpdatesSyncTypePush: jest.fn(),
}));

jest.mock('@services/db/sync/SyncUtils', () => ({
  ...jest.requireActual('@services/db/sync/SyncUtils'),
  getLastSyncedForTable: jest.fn(),
  getQueryObjForTable: jest.fn(),
  filterRowsForInsertion: jest.fn(),
  insertSyncUpdate: jest.fn(),
  getRowsToSyncPush: jest.fn(),
}));

jest.mock('@services/db/Functions', () => ({
  ...jest.requireActual('@services/db/Functions'),
  insertRows: jest.fn(),
  updateRows: jest.fn(),
}));

// Mocking the BodyStat Api Class
jest.mock('@services/api/swagger/BodyStat', () => ({
  BodyStat: jest.fn().mockImplementation(() => ({
    postBodyStat: jest.fn().mockResolvedValue({
      // Should be the sampleStat var.
      // Probaly could be if defining mock in test worked...
      data: [
        {
          body_stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
          stat_type: 'weight',
          unit: 'kg',
          timezone: 'UTC',
          created_at: '2025-01-01T00:00:00.000',
          updated_at: '2025-01-01T00:01:00.000',
          user_id: 1,
          value: 500,
        },
      ],
    }),
  })),
}));

describe('SyncType Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test(`processSyncTypePull SyncOperation '${SyncOperation.Creates}`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest.spyOn(SyncUtilsFunctions, 'getLastSyncedForTable').mockResolvedValue({
      created_at: sampleCreatedAtTimestamp,
      updated_at: sampleUpdatedAtTimestamp,
    });

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockResolvedValue(getQueryObjForTableSampleResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'filterRowsForInsertion')
      .mockResolvedValue([sampleStat]);

    // Act
    await processSyncTypePull(
      tableToSync,
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Creates,
      sampleSyncStartTimestamp,
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

    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.insertSyncUpdate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      last_synced: sampleStat.created_at,
      sync_type: SyncType.Pull,
      sync_operation: SyncOperation.Creates,
    });
  });

  test(`processSyncTypePull SyncOperation '${SyncOperation.Updates}`, async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.bodyStatTable;
    jest.spyOn(SyncUtilsFunctions, 'getLastSyncedForTable').mockResolvedValue({
      created_at: sampleCreatedAtTimestamp,
      updated_at: sampleUpdatedAtTimestamp,
    });

    jest
      .spyOn(SyncUtilsFunctions, 'getQueryObjForTable')
      .mockResolvedValue(getQueryObjForTableSampleResponse);

    jest
      .spyOn(SyncUtilsFunctions, 'filterRowsForInsertion')
      .mockResolvedValue([sampleStat]);

    // Act
    await processSyncTypePull(
      tableToSync,
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
    );

    // Assert
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );

    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(SyncUtilsFunctions.getQueryObjForTable).toHaveBeenCalledWith(
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      SyncOperation.Updates,
      sampleSyncStartTimestamp,
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
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
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
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
    );
  });
});
