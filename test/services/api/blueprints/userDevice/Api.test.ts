// Constants
import * as Apis from '@services/api/ApiService';

// Types
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';

// Functions
import {createDevice} from '@services/api/blueprints/device/Api';
import * as dbFunctions from '@services/db/Functions';
import {syncDbTables} from '@shared/Constants';
import * as UserDeviceLinkFunctions from '@services/api/blueprints/user_device_link/Api';
import logger from '@utils/Logger';

// Mocks
jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getCurrentTimestampTimezone: jest.fn().mockReturnValue({
    timestamp: '2025-01-01T00:00:00.000',
    timezone: 'UTC',
  }),
}));
jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn().mockResolvedValue('mockedDeviceId'),
  getBrand: jest.fn().mockReturnValue('mockedBrand'),
  getDeviceId: jest.fn().mockReturnValue('mockedModel'),
}));
jest.mock('@services/db/Functions', () => ({
  ...jest.requireActual('@services/db/Functions'),
  insertRows: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fakeUuid'),
}));
jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    getToken: jest.fn(() => Promise.resolve('mockedFcmToken')),
  });
});
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn().mockReturnValue(true),
}));

describe('Device Api tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const fakeUserId = 'fakeUserId';
  const fakeDeviceId = 'fakeDeviceId';
  let deviceRow: DeviceCreateSchema = {
    brand: 'mockedBrand',
    created_at: '2025-01-01T00:00:00.000',
    device_fcm: 'mockedFcmToken',
    device_id: 'fakeUuid',
    device_internal_id: 'fakeDeviceId',
    model: 'mockedModel',
    timezone: 'UTC',
  };

  test('createDevice api returns success', async () => {
    // Arrange
    jest
      .spyOn(Apis.DeviceApi, 'createCreate')
      .mockResolvedValue({status: 201} as any);
    jest
      .spyOn(UserDeviceLinkFunctions, 'createUserDeviceLink')
      .mockResolvedValue();

    // Act
    const response = await createDevice(fakeUserId, fakeDeviceId);

    // Assert
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledWith(deviceRow);

    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.deviceTable,
      [deviceRow],
    );

    expect(UserDeviceLinkFunctions.createUserDeviceLink).toHaveBeenCalledTimes(
      1,
    );
    expect(UserDeviceLinkFunctions.createUserDeviceLink).toHaveBeenCalledWith(
      'fakeUuid',
      fakeUserId,
    );

    expect(response).toEqual({
      internalDeviceId: fakeDeviceId,
      deviceId: 'fakeUuid',
    });
  });

  test('createDevice api returns success, deviceInternalId not passed', async () => {
    // Arrange
    let deviceRow2 = {...deviceRow};
    deviceRow2.device_internal_id = 'mockedDeviceId';

    jest
      .spyOn(Apis.DeviceApi, 'createCreate')
      .mockResolvedValue({status: 201} as any);
    jest
      .spyOn(UserDeviceLinkFunctions, 'createUserDeviceLink')
      .mockResolvedValue();

    // Act
    const response = await createDevice(fakeUserId);

    // Assert
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledWith(deviceRow2);

    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.deviceTable,
      [deviceRow2],
    );

    expect(UserDeviceLinkFunctions.createUserDeviceLink).toHaveBeenCalledTimes(
      1,
    );
    expect(UserDeviceLinkFunctions.createUserDeviceLink).toHaveBeenCalledWith(
      'fakeUuid',
      fakeUserId,
    );

    expect(response).toEqual({
      internalDeviceId: 'mockedDeviceId',
      deviceId: 'fakeUuid',
    });
  });

  test('createDevice api request returns wrong status code', async () => {
    // Arrange
    jest
      .spyOn(Apis.DeviceApi, 'createCreate')
      .mockResolvedValue({status: 209} as any);
    jest
      .spyOn(UserDeviceLinkFunctions, 'createUserDeviceLink')
      .mockResolvedValue();

    // Act
    const response = await createDevice(fakeUserId, fakeDeviceId);

    // Assert
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledWith(deviceRow);

    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(0);
    expect(UserDeviceLinkFunctions.createUserDeviceLink).toHaveBeenCalledTimes(
      0,
    );

    expect(logger.warn).toHaveBeenCalledWith(
      `Unexpected status code for Device createCreate: ${209}`,
    );

    expect(response).toEqual(null);
  });

  test('createDevice api request throws error', async () => {
    // Arrange
    const fakeErrorMessage = 'fakeErrorMessage';
    jest.spyOn(Apis.DeviceApi, 'createCreate').mockRejectedValue({
      status: 500,
      message: fakeErrorMessage,
    } as any);
    jest
      .spyOn(UserDeviceLinkFunctions, 'createUserDeviceLink')
      .mockResolvedValue();

    // Act
    const response = await createDevice(fakeUserId, fakeDeviceId);

    // Assert
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.DeviceApi.createCreate).toHaveBeenCalledWith(deviceRow);

    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(0);
    expect(UserDeviceLinkFunctions.createUserDeviceLink).toHaveBeenCalledTimes(
      0,
    );

    expect(logger.warn).toHaveBeenCalledWith(
      `Unexpected error for Device createCreate: ${fakeErrorMessage}`,
    );

    expect(response).toEqual(null);
  });
});
