// Test Objects
import {sampleStat} from '../../../Objects';
import {SyncCreateSchemas} from '@services/db/sync/Types';
import {syncDbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';
// Functionsx
import {
  processUpdatesSyncTypePush,
  processCreatesSyncTypePush,
} from '@services/db/sync/SyncOperations';
import {insertSyncUpdate} from '@services/db/sync/SyncUtils';
import {
  storeFailedSyncPushErrors,
  getFailedSyncPushesUpdatesForTable,
} from '@services/asyncStorage/Functions';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';

jest.mock('@services/db/sync/SyncUtils', () => ({
  ...jest.requireActual('@services/db/sync/SyncUtils'),
  insertSyncUpdate: jest.fn(),
}));

// Mocking the Stat Api Class
jest.mock('@services/api/swagger/Stat', () => ({
  Stat: jest.fn().mockImplementation(() => ({
    createCreate: jest
      .fn()
      .mockResolvedValueOnce({status: 201})
      .mockResolvedValueOnce({status: 201})
      .mockResolvedValueOnce({status: 500}),
    updateUpdate: jest
      .fn()
      .mockResolvedValueOnce({status: 204})
      .mockResolvedValueOnce({status: 204})
      .mockResolvedValueOnce({status: 500}),
  })),
}));

jest.mock('@services/asyncStorage/Functions', () => ({
  ...jest.requireActual('@services/asyncStorage/Functions'),
  getFailedSyncPushesCreatesForTable: jest.fn().mockResolvedValue([
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
  getFailedSyncPushesUpdatesForTable: jest.fn().mockResolvedValue([
    {
      stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
      stat_type: 'water',
      unit: 'ml',
      updated_at: '2025-01-01T00:01:00.000',
      user_id: 1,
      value: 500,
    },
  ]),
  storeFailedSyncPushErrors: jest.fn(),
}));

describe('Sync Operation Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('processUpdatesSyncTypePush with one row', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    // Assert

    expect(getFailedSyncPushesUpdatesForTable).toHaveBeenCalledTimes(1);
    expect(getFailedSyncPushesUpdatesForTable).toHaveBeenCalledWith(
      syncDbTables.statTable,
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.updated_at,
      sync_operation: SyncOperation.Updates,
      sync_type: SyncType.Push,
      table_name: syncDbTables.statTable,
    });
  });

  test('processUpdatesSyncTypePush with no rows', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [];
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    // Assert
    expect(insertSyncUpdate).toHaveBeenCalledTimes(0);
  });

  test('processUpdatesSyncTypePush with request failure', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.statTable;
    const {timezone, created_at, ...updatedStat} = sampleStat;
    timezone;
    created_at;

    // Act
    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    // Assert
    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(storeFailedSyncPushErrors).toHaveBeenCalledTimes(1);
    expect(storeFailedSyncPushErrors).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncOperation.Updates,
      [updatedStat, updatedStat],
    );
  });

  test('processCreatesSyncTypePush with one row', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    // Assert
    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.created_at,
      sync_operation: SyncOperation.Creates,
      sync_type: SyncType.Push,
      table_name: syncDbTables.statTable,
    });
  });

  test('processCreatesSyncTypePush with no rows', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [];
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    // Assert
    expect(insertSyncUpdate).toHaveBeenCalledTimes(0);
  });

  test('processCreatesSyncTypePush with request failure', async () => {
    // Arrange
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: syncDbTables = syncDbTables.statTable;

    // Act
    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    // Assert
    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(storeFailedSyncPushErrors).toHaveBeenCalledTimes(1);
    expect(storeFailedSyncPushErrors).toHaveBeenCalledWith(
      syncDbTables.statTable,
      SyncOperation.Creates,
      [sampleStat, sampleStat],
    );
  });
});
