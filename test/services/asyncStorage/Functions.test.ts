// Classes
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
import {syncDbTables} from '@shared/Constants';
import {SyncOperation} from '@services/api/swagger/data-contracts';

// Types
import {SyncCreateSchemas, SyncUpdateSchemas} from '@services/db/sync/Types';
import {sampleStat, sampleUpdatedStat} from '../../Objects';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';

// Functions
import {
  getUserDetails,
  storeFailedSyncPushErrors,
  getFailedSyncPushesCreatesForTable,
  getFailedSyncPushesUpdatesForTable,
  SyncErrorDumpApi,
} from '@services/asyncStorage/Functions';
import {SyncType} from '@shared/Enums';

// Mocking AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mocking the BodyStat Api Class
jest.mock('@services/api/swagger/SyncErrorDump', () => ({
  SyncErrorDump: jest.fn().mockImplementation(() => ({
    createCreate: jest.fn().mockResolvedValue({status: 204}),
  })),
}));

describe('getUserDetails', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  it('Gets value when present', async () => {
    // Arrange
    const fieldName = 'username';
    const fieldValue = 'johndoe';
    const user_details = JSON.stringify({[fieldName]: fieldValue});

    // AsyncStorage mock to return user details
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(user_details);

    // Act
    const result = await getUserDetails(fieldName);

    // Assert
    expect(result).toBe(fieldValue);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user-details-key');
  });

  it('Throws error when field not present', async () => {
    // Arrange
    const fieldName = 'username';
    const fieldValue = 'johndoe';
    const user_details = JSON.stringify({[fieldName]: fieldValue});
    const target_field = 'email';

    // AsyncStorage mock to return user details
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(user_details);

    // Act and Assert
    //getUserDetails(target_field)
    await expect(getUserDetails(target_field)).rejects.toThrow(
      'Error retrieving user details: Field email not found in user details',
    );
  });

  it('Throws error when user details not present', async () => {
    // Arrange
    const target_field = 'email';

    // AsyncStorage mock to return user details
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    // Act and Assert
    //getUserDetails(target_field)
    await expect(getUserDetails(target_field)).rejects.toThrow(
      'Error retrieving user details: User details not found in AsyncStorage',
    );
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
