// Constants
import {apiFunctions} from '@services/db/sync/Constants';
import {syncDbTables} from '@shared/Constants';

// Types
import {SyncOperation} from '@shared/Enums';

// Functions
import {runSyncProcess} from '@services/db/sync/SyncProcess';
import {
  processSyncTypePull,
  processSyncTypePush,
} from '@services/db/sync/SyncTypes';

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

jest.mock('@services/db/sync/SyncTypes', () => ({
  processSyncTypePush: jest.fn(),
  processSyncTypePull: jest.fn(),
}));

describe('Sync Process Tests', () => {
  test('runSyncProcess', async () => {
    // Arrange
    // Act
    await runSyncProcess();

    // Assert
    expect(processSyncTypePull).toHaveBeenCalledTimes(2);
    expect(processSyncTypePull).toHaveBeenCalledWith(
      syncDbTables.statTable,
      apiFunctions[syncDbTables.statTable],
      SyncOperation.Creates,
    );
    expect(processSyncTypePull).toHaveBeenCalledWith(
      syncDbTables.statTable,
      apiFunctions[syncDbTables.statTable],
      SyncOperation.Updates,
    );
    expect(processSyncTypePush).toHaveBeenCalledTimes(2);
    expect(processSyncTypePush).toHaveBeenCalledWith(
      syncDbTables.statTable,
      apiFunctions[syncDbTables.statTable],
      SyncOperation.Creates,
    );
    expect(processSyncTypePush).toHaveBeenCalledWith(
      syncDbTables.statTable,
      apiFunctions[syncDbTables.statTable],
      SyncOperation.Updates,
    );
  });
});
