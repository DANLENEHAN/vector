// Test Objects

import {syncDbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';

// Functions
import {
  getLastSyncedForTable,
  getQueryObjForTable,
  insertSyncUpdate,
  getRowsToSync,
} from '@services/db/sync/SyncUtils';
import {
  processSyncTypePush,
  processSyncTypePull,
} from '@services/db/sync/SyncTypes';
import {
  processCreatesSyncTypePush,
  processUpdatesSyncTypePush,
} from '@services/db/sync/SyncOperations';
import * as dbFunctions from '@services/db/Functions';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';
import {sampleStat} from '../../../Objects';
import {SyncCreateSchemas} from '@services/db/sync/Types';
import {SyncTableFunctions} from '@services/db/sync/Types';
import {SyncUpdateSchemas} from '@services/db/sync/Types';

jest.mock('@services/db/sync/SyncUtils', () => ({
  ...jest.requireActual('@services/db/sync/SyncUtils'),
  insertSyncUpdate: jest.fn(),
  getQueryObjForTable: jest.fn(),
  getLastSyncedForTable: jest.fn().mockResolvedValue('2025-01-01T00:00:00.000'),
  getRowsToSync: jest.fn().mockResolvedValue([
    {
      stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
      stat_type: 'water',
      unit: 'ml',
      timezone: 'UTC',
      created_at: '2025-01-01T00:00:00.000',
      updated_at: '2025-01-01T00:01:00.000',
      user_id: 1,
      value: 500,
    },
  ]),
}));

// Mocking the Stat Api Class
jest.mock('@services/api/swagger/Stat', () => ({
  Stat: jest.fn().mockImplementation(() => ({
    postStat: jest.fn().mockResolvedValue({
      // Should be the sampleStat var.
      // Probaly could be if defining mock in test worked...
      data: [
        {
          stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
          stat_type: 'water',
          unit: 'ml',
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

jest.mock('@services/db/sync/SyncOperations', () => ({
  ...jest.requireActual('@services/db/sync/SyncOperations'),
  processCreatesSyncTypePush: jest.fn(),
  processUpdatesSyncTypePush: jest.fn(),
}));

jest.mock('@services/db/Functions', () => ({
  ...jest.requireActual('@services/db/Functions'),
  insertRows: jest.fn(),
  runSqlSelect: jest.fn(),
}));

describe('SyncType Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test("processSyncTypePush SyncOperation 'Creates'", async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processSyncTypePush(
      tableToSync,
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
      SyncOperation.Creates,
    );

    // Assert
    expect(getLastSyncedForTable).toHaveBeenCalledTimes(1);
    expect(getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncType.Push,
      SyncOperation.Creates,
    );

    expect(getRowsToSync).toHaveBeenCalledTimes(1);
    expect(getRowsToSync).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncOperation.Creates,
      '2025-01-01T00:00:00.000',
    );

    expect(processCreatesSyncTypePush).toHaveBeenCalledTimes(1);
    expect(processCreatesSyncTypePush).toHaveBeenCalledWith(
      [sampleStat],
      syncDbTables.statTable,
      apiFunctions[syncDbTables.statTable],
    );
  });

  test("processSyncTypePush SyncOperation 'Updates'", async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processSyncTypePush(
      tableToSync,
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
      SyncOperation.Updates,
    );

    // Assert
    expect(getLastSyncedForTable).toHaveBeenCalledTimes(1);
    expect(getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncType.Push,
      SyncOperation.Updates,
    );

    expect(getRowsToSync).toHaveBeenCalledTimes(1);
    expect(getRowsToSync).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncOperation.Updates,
      '2025-01-01T00:00:00.000',
    );

    expect(processUpdatesSyncTypePush).toHaveBeenCalledTimes(1);
    expect(processUpdatesSyncTypePush).toHaveBeenCalledWith(
      [sampleStat],
      syncDbTables.statTable,
      apiFunctions[syncDbTables.statTable],
    );
  });

  test("processSyncTypePull sync operation 'Creates'", async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.statTable;
    jest.spyOn(dbFunctions, 'runSqlSelect').mockResolvedValue([]);

    // Act
    await processSyncTypePull(
      tableToSync,
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
      SyncOperation.Creates,
    );

    // Assert
    expect(getLastSyncedForTable).toHaveBeenCalledTimes(1);
    expect(getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncType.Pull,
      SyncOperation.Creates,
    );

    expect(getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(getQueryObjForTable).toHaveBeenCalledWith(
      '2025-01-01T00:00:00.000',
      SyncOperation.Creates,
    );

    expect(dbFunctions.runSqlSelect).toHaveBeenCalledTimes(1);
    expect(dbFunctions.runSqlSelect).toHaveBeenCalledWith(
      'SELECT stat_id FROM stat WHERE stat_id IN (?)',
      ['67f6127d-13cc-4c27-b91f-2b1f83c48eeb'],
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.created_at,
      sync_operation: SyncOperation.Creates,
      sync_type: SyncType.Pull,
      table_name: syncDbTables.statTable,
    });
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.statTable,
      [sampleStat],
    );
  });

  test("processSyncTypePull sync operation 'Creates' row existing", async () => {
    // Arrange
    const tableToSync: syncDbTables = syncDbTables.statTable;
    jest
      .spyOn(dbFunctions, 'runSqlSelect')
      .mockResolvedValue([sampleStat.stat_id]);

    // Act
    await processSyncTypePull(
      tableToSync,
      apiFunctions[tableToSync] as SyncTableFunctions<
        SyncCreateSchemas,
        SyncUpdateSchemas
      >,
      SyncOperation.Creates,
    );

    // Assert

    expect(getLastSyncedForTable).toHaveBeenCalledTimes(1);
    expect(getLastSyncedForTable).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncType.Pull,
      SyncOperation.Creates,
    );

    expect(getQueryObjForTable).toHaveBeenCalledTimes(1);
    expect(getQueryObjForTable).toHaveBeenCalledWith(
      '2025-01-01T00:00:00.000',
      SyncOperation.Creates,
    );

    expect(dbFunctions.runSqlSelect).toHaveBeenCalledTimes(1);
    expect(dbFunctions.runSqlSelect).toHaveBeenCalledWith(
      'SELECT stat_id FROM stat WHERE stat_id IN (?)',
      ['67f6127d-13cc-4c27-b91f-2b1f83c48eeb'],
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.created_at,
      sync_operation: SyncOperation.Creates,
      sync_type: SyncType.Pull,
      table_name: syncDbTables.statTable,
    });
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(0);
  });
});
