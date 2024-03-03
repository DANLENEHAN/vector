// Functions
import * as SystemEventFunctions from '@services/system/SystemEvents';
import * as SystemFunctions from '@services/system/Functions';
import * as UserFunctions from '@services/db/user/Functions';
import * as ClientSessionEventFunctions from '@services/api/blueprints/clientSessionEvent/Functions';
import * as StreakFunctions from '@services/notifcations/streak/Functions';
import * as SyncProcessFunctions from '@services/db/sync/SyncProcess';
import * as DeviceFunctions from '@services/api/blueprints/device/Functions';

// Types
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';

// Test Objects
import {sampleUser} from '../../Objects';
import {AppEntryType} from '@services/system/Types';

jest.mock('@services/db/user/Functions', () => ({
  ...jest.requireActual('@services/db/user/Functions'),
  getUser: jest.fn(),
}));

jest.mock('@services/api/blueprints/clientSessionEvent/Functions', () => ({
  ...jest.requireActual(
    '@services/api/blueprints/clientSessionEvent/Functions',
  ),
  handleClientSessionEvent: jest.fn().mockResolvedValue(null),
}));

jest.mock('@services/notifcations/streak/Functions', () => ({
  ...jest.requireActual('@services/notifcations/streak/Functions'),
  checkStreakBreak: jest.fn().mockResolvedValue(null),
  registerStreakNotifcation: jest.fn().mockResolvedValue(null),
}));

jest.mock('@services/db/sync/SyncProcess', () => ({
  ...jest.requireActual('@services/db/sync/SyncProcess'),
  runSyncProcess: jest.fn().mockResolvedValue(null),
}));

jest.mock('@services/api/blueprints/device/Functions', () => ({
  ...jest.requireActual('@services/api/blueprints/device/Functions'),
  retrieveOrRegisterDeviceId: jest.fn().mockResolvedValue(null),
}));

describe('SystemEvents Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('appEntryCallback - Type LoginTokenOnline', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValueOnce(sampleUser);
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOnline,
    );

    // Assert
    expect(UserFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.AppOpen);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(DeviceFunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginTokenOnline, is not first app entry', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValueOnce(sampleUser);
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(false);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOnline,
    );

    // Assert
    expect(UserFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.AppOpen);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(0);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(DeviceFunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.registerStreakNotifcation).toHaveBeenCalledTimes(0);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginTokenOnline, getUser returns null', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValueOnce(null);
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOnline,
    );

    // Assert
    expect(UserFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.AppOpen);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(DeviceFunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(0);
    expect(StreakFunctions.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginTokenOffline', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValueOnce(sampleUser);
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOffline,
    );

    // Assert
    expect(UserFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.AppOpen);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(0);
    expect(DeviceFunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(0);
    expect(StreakFunctions.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginAuthenticated', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValueOnce(sampleUser);
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginAuthed,
    );

    // Assert
    expect(UserFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(2);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(1, ClientSessionEventType.AppOpen);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(2, ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(DeviceFunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type CreateAccAuthed', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValueOnce(sampleUser);
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.CreateAccAuthed,
    );

    // Assert
    expect(UserFunctions.getUser).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(2);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(1, ClientSessionEventType.AppOpen);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(2, ClientSessionEventType.CreateAccount);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(3, ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(DeviceFunctions.retrieveOrRegisterDeviceId).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });
});
