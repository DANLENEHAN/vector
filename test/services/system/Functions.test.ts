// Functions
import {isFirstAppEntryToday, getDeviceInfo} from '@services/system/Functions';
import logger from '@utils/Logger';
import * as DbOperationsFunctions from '@services/db/Operations';
import * as DateFunctions from '@services/date/Functions';

// Types
import {SessionEventDeviceInfo} from '@services/system/Types';
import {syncDbTables, timestampFields} from '@shared/Constants';
import {
  BaseOperators,
  ClientSessionEventType,
  NumericOperators,
} from '@services/api/swagger/data-contracts';

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn().mockResolvedValue('mockedDeviceId'),
  getUserAgent: jest.fn().mockResolvedValue('mockedUserAgent'),
  getBrand: jest
    .fn()
    .mockReturnValueOnce('mockedBrand')
    .mockImplementationOnce(() => {
      throw 'Error!';
    }),
  getSystemVersion: jest.fn().mockReturnValue('mockedSystemVersion'),
  getVersion: jest.fn().mockReturnValue('mockedVersion'),
}));

jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getDayBoundsOfDate: jest
    .fn()
    .mockReturnValue({startOfDay: 'startOfDay', endOfDay: 'endOfDay'}),
  deviceTimestampNow: jest.fn().mockReturnValue('fakeTimeNow'),
}));

jest.mock('@services/db/Operations.ts', () => ({
  ...jest.requireActual('@services/db/Operations.ts'),
  getRows: jest.fn(),
}));

describe('System Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const deviceInfo: SessionEventDeviceInfo = {
    brand: 'mockedBrand',
    deviceId: 'mockedDeviceId',
    systemVersion: 'mockedSystemVersion',
    userAgent: 'mockedUserAgent',
    version: 'mockedVersion',
  };

  const getRowParams = {
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [`${syncDbTables.clientSessionEventTable}_id`],
    whereConditions: {
      [timestampFields.createdAt]: {
        [NumericOperators.Ge]: 'startOfDay',
        [NumericOperators.Le]: 'endOfDay',
      },
      event_type: {
        [BaseOperators.Eq]: ClientSessionEventType.LoggedIn,
      },
    },
  };

  test('isFirstAppEntryToday - is first entry', async () => {
    // Arrange
    jest.spyOn(DbOperationsFunctions, 'getRows').mockResolvedValueOnce([
      {
        client_session_event: 'fakeId',
      },
    ]);

    // Act
    const response = await isFirstAppEntryToday();

    // Assert
    expect(DateFunctions.getDayBoundsOfDate).toHaveBeenCalledTimes(1);
    expect(DateFunctions.getDayBoundsOfDate).toHaveBeenCalledWith(
      'fakeTimeNow',
    );
    expect(DbOperationsFunctions.getRows).toHaveBeenCalledTimes(1);
    expect(DbOperationsFunctions.getRows).toHaveBeenCalledWith(getRowParams);
    expect(response).toEqual(true);
  });

  test("isFirstAppEntryToday - isn't first entry", async () => {
    // Arrange
    jest
      .spyOn(DbOperationsFunctions, 'getRows')
      .mockResolvedValueOnce([
        {client_session_event: 'fakeId'},
        {client_session_event: 'fakeIdTwo'},
      ]);

    // Act
    const response = await isFirstAppEntryToday();

    // Assert
    expect(DateFunctions.getDayBoundsOfDate).toHaveBeenCalledTimes(1);
    expect(DateFunctions.getDayBoundsOfDate).toHaveBeenCalledWith(
      'fakeTimeNow',
    );
    expect(DbOperationsFunctions.getRows).toHaveBeenCalledTimes(1);
    expect(DbOperationsFunctions.getRows).toHaveBeenCalledWith(getRowParams);
    expect(response).toEqual(false);
  });

  test("isFirstAppEntryToday - isn't first entry", async () => {
    // Arrange
    jest
      .spyOn(DbOperationsFunctions, 'getRows')
      .mockResolvedValueOnce([
        {client_session_event: 'fakeId'},
        {client_session_event: 'fakeIdTwo'},
      ]);

    // Act
    const response = await isFirstAppEntryToday();

    // Assert
    expect(DateFunctions.getDayBoundsOfDate).toHaveBeenCalledTimes(1);
    expect(DateFunctions.getDayBoundsOfDate).toHaveBeenCalledWith(
      'fakeTimeNow',
    );
    expect(DbOperationsFunctions.getRows).toHaveBeenCalledTimes(1);
    expect(DbOperationsFunctions.getRows).toHaveBeenCalledWith(getRowParams);
    expect(response).toEqual(false);
  });

  test('getDeviceInfo apis return no errors', async () => {
    // Arrange
    // Assert
    const response = await getDeviceInfo();
    // Act
    expect(response).toEqual(deviceInfo);
  });

  test('getDeviceInfo apis returns errors', async () => {
    // Arrange
    // Assert
    const response = await getDeviceInfo();
    // Act
    expect(response).toEqual(null);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(`Error in getDeviceInfo: Error!`);
  });
});
