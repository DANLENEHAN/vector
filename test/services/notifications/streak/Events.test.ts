// Functions
import * as StreakFunctions from '@services/notifcations/streak/Functions';
import {registerStreakNotifcation} from '@services/notifcations/streak/Events';
import * as DateFunctions from '@services/date/Functions';
import PushNotification from 'react-native-push-notification';

// Services
import logger from '@utils/Logger';

// Test Objects
import {sampleMoment} from '../../db/Objects';

jest.mock('react-native-push-notification', () => ({
  localNotificationSchedule: jest.fn(),
}));
jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  deviceTimestampNow: jest.fn(),
}));

jest.mock('@services/notifcations/streak/Functions', () => ({
  ...jest.requireActual('@services/notifcations/streak/Functions'),
  getStreak: jest.fn(),
}));

describe('Streak Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registerStreakNotifcation', async () => {
    // Arrange
    jest
      .spyOn(DateFunctions, 'deviceTimestampNow')
      .mockReturnValueOnce(sampleMoment);
    jest.spyOn(StreakFunctions, 'getStreak').mockResolvedValue(3);
    // Act
    const response = await registerStreakNotifcation();

    // Assert
    expect(PushNotification.localNotificationSchedule).toHaveBeenCalledTimes(1);
    expect(PushNotification.localNotificationSchedule).toHaveBeenCalledWith({
      allowWhileIdle: true,
      date: new Date(2024, 2, 1, 9, 0, 0),
      id: 1111111111,
      message:
        "You've logged in 3 days in a row! \n" +
        'Log in before Midnight to make it 4!',
    });

    expect(response).toEqual(undefined);
  });

  test('registerStreakNotifcation - streak null', async () => {
    // Arrange
    jest
      .spyOn(DateFunctions, 'deviceTimestampNow')
      .mockReturnValueOnce(sampleMoment);
    jest.spyOn(StreakFunctions, 'getStreak').mockResolvedValue(null);
    // Act
    const response = await registerStreakNotifcation();

    // Assert
    expect(PushNotification.localNotificationSchedule).toHaveBeenCalledTimes(0);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      "Can't get streak will not setup streak notifcation",
    );
    expect(response).toEqual(undefined);
  });
});
