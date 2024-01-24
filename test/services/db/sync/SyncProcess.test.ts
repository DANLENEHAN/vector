// Constants
import {apiFunctions} from '@services/db/sync/Constants';
import {dbTables} from '@shared/Constants';

// Types
import {SyncOperation} from '@shared/Enums';

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
  test('runSyncProcess', async () => {
    // Arrange
    // Act
    await runSyncProcess();

    // Assert
    expect(processSyncTypePull).toHaveBeenCalledTimes(2);
    expect(processSyncTypePull).toHaveBeenCalledWith(
      dbTables.statTable,
      apiFunctions[dbTables.statTable],
      SyncOperation.Creates,
    );
    expect(processSyncTypePull).toHaveBeenCalledWith(
      dbTables.statTable,
      apiFunctions[dbTables.statTable],
      SyncOperation.Updates,
    );
    expect(processSyncTypePush).toHaveBeenCalledTimes(2);
    expect(processSyncTypePush).toHaveBeenCalledWith(
      dbTables.statTable,
      apiFunctions[dbTables.statTable],
      SyncOperation.Creates,
    );
    expect(processSyncTypePush).toHaveBeenCalledWith(
      dbTables.statTable,
      apiFunctions[dbTables.statTable],
      SyncOperation.Updates,
    );
  });
});
