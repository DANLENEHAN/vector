// Test Objects
import {sampleStat} from '../../../Objects';
import {SyncCreateSchemas} from '@services/db/sync/Types';
import {syncDbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';
// Functions
import {
  processUpdatesSyncTypePush,
  processCreatesSyncTypePush,
} from '@services/db/sync/SyncOperations';
import {insertSyncUpdate} from '@services/db/sync/SyncUtils';
import {storeFailedSyncPushErrors} from '@services/asyncStorage/Functions';

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
      .mockResolvedValue({status: 201})
      .mockResolvedValueOnce({status: 201})
      .mockResolvedValueOnce({status: 500}),
    updateUpdate: jest
      .fn()
      .mockResolvedValue({status: 204})
      .mockResolvedValueOnce({status: 204})
      .mockResolvedValueOnce({status: 500}),
  })),
}));

jest.mock('@services/asyncStorage/Functions', () => ({
  ...jest.requireActual('@services/asyncStorage/Functions'),
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
    const updatedStat = sampleStat;
    // We transform to a SyncUpdateSchema in processUpdatesSyncTypePush
    delete updatedStat.created_at;
    delete updatedStat.timezone;

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
      [updatedStat],
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
      [sampleStat],
    );
  });
});
