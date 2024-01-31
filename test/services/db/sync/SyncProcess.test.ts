// Constants
import {apiFunctions} from '@services/db/sync/Constants';
import {syncDbTables} from '@shared/Constants';

// Types
import {SyncOperation} from '@services/api/swagger/data-contracts';

// Functions
import {runSyncProcess} from '@services/db/sync/SyncProcess';
import {
  processSyncTypePull,
  processSyncTypePush,
} from '@services/db/sync/SyncTypes';

jest.mock('@services/db/sync/SyncTypes', () => ({
  processSyncTypePush: jest.fn(),
  processSyncTypePull: jest.fn(),
}));

describe('Sync Process Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('runSyncProcess', async () => {
    // Arrange
    // Act
    await runSyncProcess();

    // Assert
    expect(processSyncTypePull).toHaveBeenCalledTimes(
      Object.entries(apiFunctions).length * 2,
    );
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      expect(processSyncTypePull).toHaveBeenCalledWith({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Creates,
      });
      expect(processSyncTypePull).toHaveBeenCalledWith({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Updates,
      });
    }

    expect(processSyncTypePush).toHaveBeenCalledTimes(
      Object.entries(apiFunctions).length * 2,
    );
    for (const [tableName, tableFunctions] of Object.entries(apiFunctions)) {
      expect(processSyncTypePush).toHaveBeenCalledWith({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Creates,
      });
      expect(processSyncTypePush).toHaveBeenCalledWith({
        tableName: tableName as syncDbTables,
        syncFunctions: tableFunctions,
        syncOperation: SyncOperation.Updates,
      });
    }
  });
});
