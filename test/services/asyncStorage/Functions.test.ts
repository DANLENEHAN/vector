// Classes
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
import {syncDbTables} from '@shared/Constants';
import {SyncOperation} from '@services/api/swagger/data-contracts';
import {SyncErrorDumpApi} from '@services/api/ApiService';

// Types
import {SyncCreateSchemas, SyncUpdateSchemas} from '@services/db/sync/Types';
import {sampleStat, sampleUpdatedStat} from '../../Objects';

import {AsyncStorageKeys} from '@services/asyncStorage/Constants';

// Functions
import {
  storeFailedSyncPushErrors,
  getFailedSyncPushesCreatesForTable,
  getFailedSyncPushesUpdatesForTable,
  deleteSuccessfulSyncPushErrors,
} from '@services/asyncStorage/Functions';
import {SyncType} from '@shared/Enums';

// Mocking AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mocking the BodyStat Api Class
jest.mock('@services/api/swagger/SyncErrorDump', () => ({
  SyncErrorDump: jest.fn().mockImplementation(() => ({
    createCreate: jest.fn().mockResolvedValue({status: 204}),
  })),
}));

describe('Test AsyncStorage Functions', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  it('storeFailedSyncPushErrors first time failure', async () => {
    // Arrange
    const failedSyncPushErrors: SyncCreateSchemas[] = [sampleStat];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    // Act
    await storeFailedSyncPushErrors(
      syncDbTables.bodyStatTable,
      SyncOperation.Creates,
      failedSyncPushErrors,
    );

    // Assert
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {
            [sampleStat.body_stat_id]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
  });

  it('storeFailedSyncPushErrors max failures', async () => {
    // Arrange
    const failedSyncPushErrors: SyncCreateSchemas[] = [sampleStat];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {
            [sampleStat.body_stat_id]: {
              retries: 3,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    // Act
    await storeFailedSyncPushErrors(
      syncDbTables.bodyStatTable,
      SyncOperation.Creates,
      failedSyncPushErrors,
    );

    // Assert
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {},
        },
      }),
    );

    // Assert
    expect(SyncErrorDumpApi.createCreate).toHaveBeenCalledTimes(1);
    expect(SyncErrorDumpApi.createCreate).toHaveBeenCalledWith({
      table_name: syncDbTables.bodyStatTable,
      sync_type: SyncType.Push,
      sync_operation: SyncOperation.Creates,
      row_id: sampleStat.body_stat_id,
      data: sampleStat,
      created_at: sampleStat.created_at,
      updated_at: sampleStat.updated_at,
      timezone: sampleStat.timezone,
    });
  });

  it('storeFailedSyncPushErrors Object has previously failures', async () => {
    // Arrange
    const failedSyncPushErrors: SyncCreateSchemas[] = [sampleStat];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Updates]: {
            [sampleStat.body_stat_id]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    // Act
    await storeFailedSyncPushErrors(
      syncDbTables.bodyStatTable,
      SyncOperation.Creates,
      failedSyncPushErrors,
    );

    // Assert
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Updates]: {
            [sampleStat.body_stat_id]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
          [SyncOperation.Creates]: {
            [sampleStat.body_stat_id]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
  });

  it('deleteSuccessfulSyncPushErrors removes single successful syncs', async () => {
    // Arrange
    const fakeuUid = '16945c77-6076-4dce-8921-7db976327922';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {
            [sampleStat.body_stat_id]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
            [fakeuUid]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    // Act
    await deleteSuccessfulSyncPushErrors(
      syncDbTables.bodyStatTable,
      [sampleStat.body_stat_id],
      SyncOperation.Creates,
    );

    // Assert
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {
            [fakeuUid]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
  });

  it('deleteSuccessfulSyncPushErrors removes all successful syncs', async () => {
    // Arrange
    const fakeuUid = '16945c77-6076-4dce-8921-7db976327922';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {
            [sampleStat.body_stat_id]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
            [fakeuUid]: {
              retries: 1,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    // Act
    await deleteSuccessfulSyncPushErrors(
      syncDbTables.bodyStatTable,
      [sampleStat.body_stat_id, fakeuUid],
      SyncOperation.Creates,
    );

    // Assert
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.SyncPushErrors,
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {},
        },
      }),
    );
  });

  it('getFailedSyncPushesCreatesForTable has failed pushes', async () => {
    // Arrange
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Creates]: {
            [sampleStat.body_stat_id]: {
              retries: 3,
              data: {
                ...sampleStat,
              },
            },
          },
        },
      }),
    );

    // Act
    const response: SyncCreateSchemas[] =
      await getFailedSyncPushesCreatesForTable(syncDbTables.bodyStatTable);

    // Assert
    expect(response).toEqual([sampleStat]);
  });

  it('getFailedSyncPushesCreatesForTable no failed pushes', async () => {
    // Arrange
    (AsyncStorage.getItem as jest.Mock).mockReturnValue(Promise.resolve());

    // Act
    const response: SyncCreateSchemas[] =
      await getFailedSyncPushesCreatesForTable(syncDbTables.bodyStatTable);

    // Assert
    expect(response).toEqual([]);
  });

  it('getFailedSyncPushesUpdatesForTable has failed pushes', async () => {
    // Arrange
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        [syncDbTables.bodyStatTable]: {
          [SyncOperation.Updates]: {
            [sampleUpdatedStat.body_stat_id]: {
              retries: 3,
              data: {
                ...sampleUpdatedStat,
              },
            },
          },
        },
      }),
    );

    // Act
    const response: SyncUpdateSchemas[] =
      await getFailedSyncPushesUpdatesForTable(syncDbTables.bodyStatTable);

    // Assert
    expect(response).toEqual([sampleUpdatedStat]);
  });

  it('getFailedSyncPushesUpdatesForTable no failed pushes', async () => {
    // Arrange
    (AsyncStorage.getItem as jest.Mock).mockReturnValue(Promise.resolve());

    // Act
    const response: SyncUpdateSchemas[] =
      await getFailedSyncPushesUpdatesForTable(syncDbTables.bodyStatTable);

    // Assert
    expect(response).toEqual([]);
  });
});
