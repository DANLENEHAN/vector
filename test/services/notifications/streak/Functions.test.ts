// Functions
import {
  checkStreakBreak,
  getStreak,
} from '@services/notifcations/streak/Functions';
import * as DbFunctions from '@services/db/Operations';
import * as DateFunctions from '@services/date/Functions';
import * as ClientSessionEventFunctions from '@services/api/blueprints/clientSessionEvent/Functions';

// Services
import moment from 'moment-timezone';
import {SortOrders, syncDbTables, timestampFields} from '@shared/Constants';
import {
  BaseOperators,
  ClientSessionEventType,
  NumericOperators,
} from '@services/api/swagger/data-contracts';

jest.mock('@services/db/Operations', () => ({
  ...jest.requireActual('@services/db/Operations'),
  getRows: jest.fn(),
}));

jest.mock('@services/api/blueprints/clientSessionEvent/Functions', () => ({
  ...jest.requireActual(
    '@services/api/blueprints/clientSessionEvent/Functions',
  ),
  handleClientSessionEvent: jest.fn().mockResolvedValue('Ok'),
}));

jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  deviceTimestampNow: jest.fn(),
  getDayBoundsOfDate: jest.fn(),
}));

describe('Streak Notification Function Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const sampleMoment1 = moment.tz('2024-01-01T00:00:00.000', 'UTC');
  const sampleMoment2 = moment.tz('2024-01-03T00:00:00.000', 'UTC');
  const sampleMoment3 = moment.tz('2024-01-02T00:00:00.000', 'UTC');
  const sampleMoment4 = moment.tz('2024-01-02T23:59:59.999', 'UTC');
  const latestAppOpenParams = {
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [timestampFields.createdAt],
    whereConditions: {
      event_type: {
        eq: ClientSessionEventType.AppOpen,
      },
    },
    orderConditions: {[timestampFields.createdAt]: SortOrders.DESC},
    limit: 1,
  };
  const latestAppStreakBreakParams = {
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [timestampFields.createdAt],
    whereConditions: {
      event_type: {
        eq: ClientSessionEventType.StreakBreak,
      },
    },
    orderConditions: {[timestampFields.createdAt]: SortOrders.DESC},
    limit: 1,
  };
  const firstAppOpenParams = {
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [timestampFields.createdAt],
    whereConditions: {
      event_type: {
        eq: ClientSessionEventType.AppOpen,
      },
    },
    orderConditions: {[timestampFields.createdAt]: SortOrders.ASC},
    limit: 1,
  };
  const yesterdaysAppOpenEvent = {
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [`${syncDbTables.clientSessionEventTable}_id`],
    whereConditions: {
      [timestampFields.createdAt]: {
        [NumericOperators.Ge]: sampleMoment3,
        [NumericOperators.Le]: sampleMoment4,
      },
      event_type: {
        [BaseOperators.Eq]: ClientSessionEventType.AppOpen,
      },
    },
    orderConditions: {
      [timestampFields.createdAt]: SortOrders.DESC,
    },
    limit: 1,
  };

  test('getStreak', async () => {
    // Arrange
    jest
      .spyOn(DbFunctions, 'getRows')
      .mockResolvedValueOnce([{created_at: sampleMoment2} as any])
      .mockResolvedValueOnce([{created_at: sampleMoment1} as any]);

    // Act
    const response = await getStreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(2);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(1, latestAppOpenParams);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(
      2,
      latestAppStreakBreakParams,
    );
    expect(response).toEqual(2);
  });

  test('getStreak - latestAppOpen null', async () => {
    // Arrange
    jest.spyOn(DbFunctions, 'getRows').mockResolvedValueOnce([]);

    // Act
    const response = await getStreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(1);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(1, latestAppOpenParams);
    expect(response).toEqual(null);
  });

  test('getStreak - never had a streak break', async () => {
    // Arrange
    jest
      .spyOn(DbFunctions, 'getRows')
      .mockResolvedValueOnce([{created_at: sampleMoment2} as any])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{created_at: sampleMoment1} as any]);

    // Act
    const response = await getStreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(3);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(1, latestAppOpenParams);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(
      2,
      latestAppStreakBreakParams,
    );
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(3, firstAppOpenParams);
    expect(response).toEqual(2);
  });

  test('getStreak - never has treak break and first app open null', async () => {
    // Arrange
    jest
      .spyOn(DbFunctions, 'getRows')
      .mockResolvedValueOnce([{created_at: sampleMoment2}])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    // Act
    const response = await getStreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(3);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(1, latestAppOpenParams);
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(
      2,
      latestAppStreakBreakParams,
    );
    expect(DbFunctions.getRows).toHaveBeenNthCalledWith(3, firstAppOpenParams);
    expect(response).toEqual(null);
  });

  test('checkStreakBreak - had a streak break', async () => {
    // Arrange
    jest
      .spyOn(DateFunctions, 'deviceTimestampNow')
      .mockReturnValue(sampleMoment2);
    jest.spyOn(DateFunctions, 'getDayBoundsOfDate').mockReturnValueOnce({
      startOfDay: sampleMoment3,
      endOfDay: sampleMoment4,
    });
    jest
      .spyOn(DbFunctions, 'getRows')
      .mockResolvedValueOnce([{client_session_event_id: 10}])
      .mockResolvedValueOnce([]);

    // Act
    const response = await checkStreakBreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(2);
    expect(DbFunctions.getRows).toHaveBeenCalledWith(yesterdaysAppOpenEvent);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(1);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledWith(ClientSessionEventType.StreakBreak);
    expect(response).toEqual(undefined);
  });

  test('checkStreakBreak - is first ever app entry', async () => {
    // Arrange
    jest
      .spyOn(DateFunctions, 'deviceTimestampNow')
      .mockReturnValue(sampleMoment2);
    jest.spyOn(DateFunctions, 'getDayBoundsOfDate').mockReturnValueOnce({
      startOfDay: sampleMoment3,
      endOfDay: sampleMoment4,
    });
    jest
      .spyOn(DbFunctions, 'getRows')
      .mockResolvedValueOnce([{client_session_event_id: 0}])
      .mockResolvedValueOnce([]);

    // Act
    const response = await checkStreakBreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(2);
    expect(DbFunctions.getRows).toHaveBeenCalledWith(yesterdaysAppOpenEvent);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(0);
    expect(response).toEqual(undefined);
  });

  test('checkStreakBreak - no streak break', async () => {
    // Arrange
    jest
      .spyOn(DateFunctions, 'deviceTimestampNow')
      .mockReturnValue(sampleMoment2);
    jest.spyOn(DateFunctions, 'getDayBoundsOfDate').mockReturnValueOnce({
      startOfDay: sampleMoment3,
      endOfDay: sampleMoment4,
    });
    jest
      .spyOn(DbFunctions, 'getRows')
      .mockResolvedValueOnce([{client_session_event_id: 10}])
      .mockResolvedValueOnce([{created_at: sampleMoment2}]);

    // Act
    const response = await checkStreakBreak();

    // Assert
    expect(DbFunctions.getRows).toHaveBeenCalledTimes(2);
    expect(DbFunctions.getRows).toHaveBeenCalledWith(yesterdaysAppOpenEvent);
    expect(
      ClientSessionEventFunctions.handleClientSessionEvent,
    ).toHaveBeenCalledTimes(0);
    expect(response).toEqual(undefined);
  });
});
