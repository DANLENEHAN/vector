// Functions
import * as AsyncStorageFunctions from '@services/asyncStorage/Functions';
import * as Apis from '@services/api/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DeviceApiFunctions from '@services/api/blueprints/device/Api';
import {retrieveOrRegisterDeviceId} from '@services/api/blueprints/device/Functions';
import DeviceInfo from 'react-native-device-info';

// Types
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import logger from '@utils/Logger';

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn().mockResolvedValue('fakeDeviceId'),
}));
// Mocking AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn().mockReturnValue(true),
}));

describe('User Device Function Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const fakeUserId = 'fakeUserId';
  const fakeUuid = 'fakeUuid';
  const fakeDeviceId = 'fakeDeviceId';
  const mockedDeviceIdMap = {
    internalDeviceId: fakeDeviceId,
    deviceId: fakeUuid,
  };
  const mockedNullDeviceIdMap = {
    internalDeviceId: null,
    deviceId: null,
  };
  const deviceRow: DeviceCreateSchema = {
    brand: 'mockedBrand',
    created_at: '2025-01-01T00:00:00.000',
    device_fcm: 'mockedFcmToken',
    device_id: fakeUuid,
    device_internal_id: fakeDeviceId,
    model: 'mockedModel',
    timezone: 'UTC',
  };
  const queryFilters = {
    filters: {
      device_internal_id: {
        eq: fakeDeviceId,
      },
    },
  };

  test('retrieveOrRegisterDeviceId have Device Info and return', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedDeviceIdMap);

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(response).toEqual(mockedDeviceIdMap);
  });

  test('retrieveOrRegisterDeviceId - postDevice returns data, ', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedNullDeviceIdMap);
    jest
      .spyOn(Apis.DeviceApi, 'postDevice')
      .mockResolvedValue({status: 201, data: [deviceRow]} as any);

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledWith(queryFilters);

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(mockedDeviceIdMap),
    );
    expect(response).toEqual(mockedDeviceIdMap);
  });

  test('retrieveOrRegisterDeviceId - postDevice no data, createDevice returns null', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedNullDeviceIdMap);
    jest
      .spyOn(Apis.DeviceApi, 'postDevice')
      .mockResolvedValue({status: 201, data: []} as any);
    jest.spyOn(DeviceApiFunctions, 'createDevice').mockResolvedValue(null);

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledWith(queryFilters);

    expect(DeviceApiFunctions.createDevice).toHaveBeenCalledTimes(1);
    expect(DeviceApiFunctions.createDevice).toHaveBeenCalledWith(
      fakeUserId,
      fakeDeviceId,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(mockedNullDeviceIdMap),
    );
    expect(response).toEqual(mockedNullDeviceIdMap);
  });

  test('retrieveOrRegisterDeviceId - postDevice no data, createDevice returns null', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedNullDeviceIdMap);
    jest
      .spyOn(Apis.DeviceApi, 'postDevice')
      .mockResolvedValue({status: 201, data: []} as any);
    jest
      .spyOn(DeviceApiFunctions, 'createDevice')
      .mockResolvedValue(mockedDeviceIdMap);

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledWith(queryFilters);

    expect(DeviceApiFunctions.createDevice).toHaveBeenCalledTimes(1);
    expect(DeviceApiFunctions.createDevice).toHaveBeenCalledWith(
      fakeUserId,
      fakeDeviceId,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(mockedDeviceIdMap),
    );
    expect(response).toEqual(mockedDeviceIdMap);
  });

  test('retrieveOrRegisterDeviceId - postDevice invalid status code', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedNullDeviceIdMap);
    jest
      .spyOn(Apis.DeviceApi, 'postDevice')
      .mockResolvedValue({status: 209, data: []} as any);

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledWith(queryFilters);

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(mockedNullDeviceIdMap),
    );

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `Unexpected status code for postDevice: 209`,
    );

    expect(response).toEqual(mockedNullDeviceIdMap);
  });

  test('retrieveOrRegisterDeviceId - postDevice throws error', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedNullDeviceIdMap);
    jest
      .spyOn(Apis.DeviceApi, 'postDevice')
      .mockRejectedValue({message: 'Error!'});

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledWith(queryFilters);

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(mockedNullDeviceIdMap),
    );

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `Error in retrieveOrRegisterDeviceId: Error!`,
    );

    expect(response).toEqual(mockedNullDeviceIdMap);
  });

  test('retrieveOrRegisterDeviceId - postDevice no data, createDevice throws error', async () => {
    // Arrange
    jest
      .spyOn(AsyncStorageFunctions, 'getStoredDeviceIdMap')
      .mockResolvedValue(mockedNullDeviceIdMap);
    jest
      .spyOn(Apis.DeviceApi, 'postDevice')
      .mockResolvedValue({status: 201, data: []} as any);
    jest
      .spyOn(DeviceApiFunctions, 'createDevice')
      .mockRejectedValue({message: 'Error!'});

    // Act
    const response = await retrieveOrRegisterDeviceId(fakeUserId);

    // Assert
    expect(DeviceInfo.getUniqueId).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledTimes(1);
    expect(AsyncStorageFunctions.getStoredDeviceIdMap).toHaveBeenCalledWith(
      fakeDeviceId,
    );
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.postDevice).toHaveBeenCalledWith(queryFilters);

    expect(DeviceApiFunctions.createDevice).toHaveBeenCalledTimes(1);
    expect(DeviceApiFunctions.createDevice).toHaveBeenCalledWith(
      fakeUserId,
      fakeDeviceId,
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(mockedNullDeviceIdMap),
    );

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `Error in retrieveOrRegisterDeviceId: Error!`,
    );

    expect(response).toEqual(mockedNullDeviceIdMap);
  });

  // a throw for either createDevice or postDevice
  // test log
});
