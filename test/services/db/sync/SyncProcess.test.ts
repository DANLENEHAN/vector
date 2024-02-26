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
import * as DateFunctions from '@services/date/Functions';

// Objects
import {sampleTimestampOne, sampleTimezone} from '../../../Objects';
import {SyncType} from '@shared/Enums';

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
    jest.spyOn(DateFunctions, 'getCurrentTimestampTimezone').mockReturnValue({
      timestamp: sampleTimestampOne,
      timezone: sampleTimezone,
    });

    // Act
    await runSyncProcess();

    // Assert

    // SyncTableWriteOnlyFunctions will not add to the number of pulls
    // hence the minus 4
    expect(processSyncTypePull).toHaveBeenCalledTimes(
      Object.entries(apiFunctions).length * 2 - 4,
    );

    expect(processSyncTypePush).toHaveBeenCalledTimes(
      Object.entries(apiFunctions).length * 2,
    );

    for (let [index, [tableName, tableFunctions]] of Object.entries(
      apiFunctions,
    ).entries()) {
      let call = (index + 1) * 2;
      if (tableFunctions[SyncType.Pull] !== undefined) {
        expect(processSyncTypePull).toHaveBeenNthCalledWith(
          call - 1,
          tableName as syncDbTables,
          tableFunctions[SyncType.Pull],
          SyncOperation.Creates,
          sampleTimestampOne,
        );

        expect(processSyncTypePull).toHaveBeenNthCalledWith(
          call,
          tableName as syncDbTables,
          tableFunctions[SyncType.Pull],
          SyncOperation.Updates,
          sampleTimestampOne,
        );
      }

      expect(processSyncTypePush).toHaveBeenNthCalledWith(
        call - 1,
        tableName as syncDbTables,
        tableFunctions,
        SyncOperation.Creates,
        sampleTimestampOne,
      );

      expect(processSyncTypePush).toHaveBeenNthCalledWith(
        call,
        tableName as syncDbTables,
        tableFunctions,
        SyncOperation.Updates,
        sampleTimestampOne,
      );
    }
  });
});
