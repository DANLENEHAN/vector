// Functions
import * as Apis from '@services/api/ApiService';
import {createUserDeviceLink} from '@services/api/blueprints/user_device_link/Api';
import * as dbFunctions from '@services/db/Functions';
import logger from '@utils/Logger';

// Constants
import {syncDbTables} from '@shared/Constants';

// Types
import {UserDeviceLinkCreateSchema} from '@services/api/swagger/data-contracts';

// Mocks
jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getCurrentTimestampTimezone: jest.fn().mockReturnValue({
    timestamp: '2025-01-01T00:00:00.000',
    timezone: 'UTC',
  }),
}));
jest.mock('@services/db/Functions', () => ({
  ...jest.requireActual('@services/db/Functions'),
  insertRows: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fakeUuid'),
}));

describe('User Device Link Api Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const fakeTimestamp = '2025-01-01T00:00:00.000';
  const fakeTimezone = 'UTC';
  const fakeUuid = 'fakeUuid';
  const fakeUserId = 'fakeUserId';
  const fakeDeviceId = 'fakeDeviceId';

  test('createUserDeviceLink api request successful', async () => {
    // Arrange
    const deviceLinkRow: UserDeviceLinkCreateSchema = {
      created_at: fakeTimestamp,
      timezone: fakeTimezone,
      device_id: fakeDeviceId,
      user_id: fakeUserId,
      user_device_link_id: fakeUuid,
    };
    jest.spyOn(Apis.UserDeviceLinkApi, 'createCreate').mockResolvedValue({
      status: 201,
    } as any);

    // Act
    const response = await createUserDeviceLink(fakeDeviceId, fakeUserId);

    // Assert
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.userDeviceLinkTable,
      [deviceLinkRow],
    );

    expect(Apis.UserDeviceLinkApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.UserDeviceLinkApi.createCreate).toHaveBeenCalledWith(
      deviceLinkRow,
    );

    expect(response).toEqual(undefined);
  });

  test('createUserDeviceLink api request throws error', async () => {
    // Arrange
    const deviceLinkRow: UserDeviceLinkCreateSchema = {
      created_at: fakeTimestamp,
      timezone: fakeTimezone,
      device_id: fakeDeviceId,
      user_id: fakeUserId,
      user_device_link_id: fakeUuid,
    };
    jest.spyOn(Apis.UserDeviceLinkApi, 'createCreate').mockRejectedValue({
      status: 500,
    } as any);

    // Act
    const response = await createUserDeviceLink(fakeDeviceId, fakeUserId);

    // Assert
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.userDeviceLinkTable,
      [deviceLinkRow],
    );

    expect(Apis.UserDeviceLinkApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.UserDeviceLinkApi.createCreate).toHaveBeenCalledWith(
      deviceLinkRow,
    );

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `UserDeviceLinkApi.createCreate request for deviceId: ${fakeDeviceId} ` +
        `and userId: ${fakeUserId} has failed. Will be picked up in the sync.`,
    );

    expect(response).toEqual(undefined);
  });

  test('createUserDeviceLink api request incorrect status code', async () => {
    // Arrange
    const deviceLinkRow: UserDeviceLinkCreateSchema = {
      created_at: fakeTimestamp,
      timezone: fakeTimezone,
      device_id: fakeDeviceId,
      user_id: fakeUserId,
      user_device_link_id: fakeUuid,
    };
    jest.spyOn(Apis.UserDeviceLinkApi, 'createCreate').mockResolvedValue({
      status: 209,
    } as any);

    // Act
    const response = await createUserDeviceLink(fakeDeviceId, fakeUserId);

    // Assert
    expect(dbFunctions.insertRows).toHaveBeenCalledTimes(1);
    expect(dbFunctions.insertRows).toHaveBeenCalledWith(
      syncDbTables.userDeviceLinkTable,
      [deviceLinkRow],
    );

    expect(Apis.UserDeviceLinkApi.createCreate).toHaveBeenCalledTimes(1);
    expect(Apis.UserDeviceLinkApi.createCreate).toHaveBeenCalledWith(
      deviceLinkRow,
    );

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `Unexpected status code for UserDeviceLinkApi.createCreate: ${209}`,
    );

    expect(response).toEqual(undefined);
  });
});
