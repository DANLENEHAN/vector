// Functions
import * as SystemEventFunctions from '@services/system/SystemEvents';
import * as SystemFunctions from '@services/system/Functions';
import * as ClientSessionEventFunctions from '@services/api/blueprints/clientSessionEvent/Functions';
import * as StreakFunctions from '@services/notifcations/streak/Functions';
import * as SyncProcessFunctions from '@services/db/sync/SyncProcess';
import * as StreakEvents from '@services/notifcations/streak/Events';
import * as SqlClient from '@services/db/SqlClient';
// Types
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';

// Test Objects
import {AppEntryType} from '@services/system/Types';

jest.mock('@services/api/blueprints/clientSessionEvent/Functions', () => ({
  ...jest.requireActual(
    '@services/api/blueprints/clientSessionEvent/Functions',
  ),
  handleClientSessionEvent: jest.fn().mockResolvedValue(null),
}));

jest.mock('@services/notifcations/streak/Functions', () => ({
  ...jest.requireActual('@services/notifcations/streak/Functions'),
  checkStreakBreak: jest.fn().mockResolvedValue(null),
}));

jest.mock('@services/notifcations/streak/Events', () => ({
  ...jest.requireActual('@services/notifcations/streak/Events'),
  registerStreakNotifcation: jest.fn().mockResolvedValue(null),
}));

jest.mock('@services/db/sync/SyncProcess', () => ({
  ...jest.requireActual('@services/db/sync/SyncProcess'),
  runSyncProcess: jest.fn().mockResolvedValue(null),
}));

describe('SystemEvents Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fakeUserId = 'fakeUserId';
  const openDbSpy = jest
    .spyOn(SqlClient.dbConnectionManager, 'openDatabase')
    .mockResolvedValue();

  test('appEntryCallback - Type LoginTokenOnline', async () => {
    // Arrange
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOnline,
      fakeUserId,
    );

    // Assert
    expect(openDbSpy).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(StreakEvents.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginTokenOnline, is not first app entry', async () => {
    // Arrange
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(false);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOnline,
      fakeUserId,
    );

    // Assert
    expect(openDbSpy).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(0);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(StreakEvents.registerStreakNotifcation).toHaveBeenCalledTimes(0);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginTokenOffline', async () => {
    // Arrange
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginTokenOffline,
      fakeUserId,
    );

    // Assert
    expect(openDbSpy).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(0);
    expect(StreakEvents.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type LoginAuthenticated', async () => {
    // Arrange
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.LoginAuthed,
      fakeUserId,
    );

    // Assert
    expect(openDbSpy).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(1, ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(StreakEvents.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });

  test('appEntryCallback - Type CreateAccAuthed', async () => {
    // Arrange
    jest
      .spyOn(SystemFunctions, 'isFirstAppEntryToday')
      .mockResolvedValueOnce(true);

    // Act
    const response = await SystemEventFunctions.appEntryCallback(
      AppEntryType.CreateAccAuthed,
      fakeUserId,
    );

    // Assert
    expect(openDbSpy).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenNthCalledWith(1, ClientSessionEventType.LoggedIn);
    expect(SystemFunctions.isFirstAppEntryToday).toHaveBeenCalledTimes(1);
    expect(StreakFunctions.checkStreakBreak).toHaveBeenCalledTimes(1);
    expect(SyncProcessFunctions.runSyncProcess).toHaveBeenCalledTimes(1);
    expect(StreakEvents.registerStreakNotifcation).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
  });
});
