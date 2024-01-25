// Test Objects
import {sampleStat} from '../../../objects';
import {SyncCreateSchemas} from '@services/db/sync/Types';
import {syncDbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';

// Functions
import {
  processUpdatesSyncTypePush,
  processCreatesSyncTypePush,
} from '@services/db/sync/SyncOperations';
import {insertSyncUpdate} from '@services/db/sync/SyncUtils';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';

/* Mocking external dependencies */
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mocked/document/directory/path',
}));

jest.mock('uuid', () => ({
  uuidv4: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
}));

jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
  })),
}));
/**/

jest.mock('@services/db/sync/SyncUtils', () => ({
  ...jest.requireActual('@services/db/sync/SyncUtils'),
  insertSyncUpdate: jest.fn(),
}));

// Mocking the Stat Api Class
jest.mock('@services/api/swagger/Stat', () => ({
  Stat: jest.fn().mockImplementation(() => ({
    createCreate: jest.fn().mockResolvedValue({status: 201}),
    updateUpdate: jest.fn().mockResolvedValue({status: 204}),
  })),
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
});
