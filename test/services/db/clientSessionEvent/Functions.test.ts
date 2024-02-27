// Functions
import * as SystemFunctions from '@services/system/Functions';
import * as Devicefunctions from '@services/api/blueprints/device/Functions';
import * as dbFunctions from '@services/db/Functions';
import {insertClientSessionEvent} from '@services/db/clientSessionEvent/Functions';
import * as dateFunctions from '@services/date/Functions';
import logger from '@utils/Logger';
import * as UserDbFunctions from '@services/db/user/Functions';

// Types
import {SessionEventDeviceInfo} from '@services/system/Types';

// Constants
import {
  ClientSessionEventType,
  ClientType,
  ClientSessionEventCreateSchema,
  DeviceCreateSchema,
} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {sampleUser, sampleUserId} from '../../../Objects';

jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getCurrentTimestampTimezone: jest.fn().mockReturnValue({
    timestamp: '2025-01-01T00:00:00.000',
    timezone: 'UTC',
  }),
}));
jest.mock('@services/api/blueprints/device/Api', () => ({
  retrieveOrRegisterDeviceId: jest.fn(),
}));
jest.mock('@services/db/Functions', () => ({
  ...jest.requireActual('@services/db/Functions'),
  insertRows: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mockedUuid'),
}));

describe('Test Client Session Event Functions', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const mockedDeviceId = 'mockedDeviceId';
  const mockedUuid = 'mockedUuid';
  const mockedSystemVersion = 'mockedSystemVersion';
  const mockedBrand = 'mockedBrand';
  const mockedUserAgent = 'mockedUserAgent';
  const mockedVersion = 'mockedVersion';
  const deviceInfo: SessionEventDeviceInfo = {
    brand: mockedBrand,
    deviceId: mockedDeviceId,
    systemVersion: mockedSystemVersion,
    userAgent: mockedUserAgent,
    version: mockedVersion,
  };
  let deviceRow: DeviceCreateSchema = {
    user_id: sampleUserId,
    brand: 'mockedBrand',
    created_at: '2025-01-01T00:00:00.000',
    device_fcm: 'mockedFcmToken',
    device_id: 'fakeUuid',
    device_internal_id: 'fakeDeviceId',
    model: 'mockedModel',
    timezone: 'UTC',
  };
  const clientSessionEvent: ClientSessionEventCreateSchema = {
    user_id: sampleUserId,
    event_type: ClientSessionEventType.LoggedIn,
    application_version: mockedVersion,
    client_session_event_id: mockedUuid,
    client_type: ClientType.USER_APP_DEVICE,
    created_at: '2025-01-01T00:00:00.000',
    system_version: mockedSystemVersion,
    timezone: 'UTC',
    user_agent: mockedUserAgent,
    device_id: deviceRow.device_id,
  };

  test('insertClientSessionEvent user and device not null', async () => {
    // Arrange
    jest.spyOn(SystemFunctions, 'getDeviceInfo').mockResolvedValue(deviceInfo);
    jest.spyOn(UserDbFunctions, 'getUser').mockResolvedValue(sampleUser);
    jest
      .spyOn(Devicefunctions, 'retrieveOrRegisterDeviceId')
      .mockResolvedValue(deviceRow);

    // Act
    const response = await insertClientSessionEvent(
      ClientSessionEventType.LoggedIn,
    );

    // Assert
    expect(SystemFunctions.getDeviceInfo).toHaveBeenCalledTimes(1);
    expect(dateFunctions.getCurrentTimestampTimezone).toHaveBeenCalledTimes(1);
    expect(UserDbFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(Devicefunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(1);
    expect(Devicefunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledWith(
      sampleUserId,
    );

    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.clientSessionEventTable,
      [clientSessionEvent],
    );

    expect(response).toEqual(undefined);
  });

  test('insertClientSessionEvent user null', async () => {
    // Arrange
    jest.spyOn(SystemFunctions, 'getDeviceInfo').mockResolvedValue(deviceInfo);
    jest.spyOn(UserDbFunctions, 'getUser').mockResolvedValue(null);
    // Act
    const response = await insertClientSessionEvent(
      ClientSessionEventType.LoggedIn,
    );

    // Assert
    expect(SystemFunctions.getDeviceInfo).toHaveBeenCalledTimes(1);
    expect(dateFunctions.getCurrentTimestampTimezone).toHaveBeenCalledTimes(1);
    expect(UserDbFunctions.getUser).toHaveBeenCalledTimes(1);

    expect(Devicefunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(0);
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(0);

    expect(response).toEqual(undefined);
  });

  test('insertClientSessionEvent device null', async () => {
    // Arrange
    jest.spyOn(SystemFunctions, 'getDeviceInfo').mockResolvedValue(deviceInfo);
    jest.spyOn(UserDbFunctions, 'getUser').mockResolvedValue(sampleUser);
    jest
      .spyOn(Devicefunctions, 'retrieveOrRegisterDeviceId')
      .mockResolvedValue(null);

    // Act
    const response = await insertClientSessionEvent(
      ClientSessionEventType.LoggedIn,
    );

    // Assert
    expect(SystemFunctions.getDeviceInfo).toHaveBeenCalledTimes(1);
    expect(dateFunctions.getCurrentTimestampTimezone).toHaveBeenCalledTimes(1);
    expect(UserDbFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(Devicefunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(1);
    expect(Devicefunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledWith(
      sampleUserId,
    );

    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(0);

    expect(response).toEqual(undefined);
  });

  test('insertClientSessionEvent error thrown', async () => {
    // Arrange
    jest.spyOn(SystemFunctions, 'getDeviceInfo').mockResolvedValue(deviceInfo);
    jest.spyOn(UserDbFunctions, 'getUser').mockRejectedValue('Error!');

    // Act
    const response = await insertClientSessionEvent(
      ClientSessionEventType.LoggedIn,
    );

    // Assert
    expect(SystemFunctions.getDeviceInfo).toHaveBeenCalledTimes(1);
    expect(dateFunctions.getCurrentTimestampTimezone).toHaveBeenCalledTimes(1);

    expect(UserDbFunctions.getUser).toHaveBeenCalledTimes(1);

    expect(Devicefunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(0);
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(0);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      "Don't have user or device details yet skipping...",
    );
    expect(response).toEqual(undefined);
  });
});
