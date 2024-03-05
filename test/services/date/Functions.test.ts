// Functions
import * as MomentFunctions from 'moment-timezone';
import moment from 'moment';
import * as LocalizeFunctions from 'react-native-localize';
import {
  getUtcNowAndDeviceTimezone,
  momentToDateStr,
  getDayBoundsOfDate,
} from '@services/date/Functions';
import {DateFormat} from '@shared/Enums';

jest.mock('react-native-localize', () => ({
  getTimeZone: jest.fn().mockReturnValue('Europe/Dublin'),
}));

jest.mock('moment-timezone', () => ({
  ...jest.requireActual('moment-timezone'),
  utc: jest.fn(),
  tz: jest.fn(),
}));

describe('Date Function Tests', () => {
  const fakeTimezone = 'America/Toronto';
  const sampleDateString = '2024-01-01T00:00:00.000';
  const sampleMoment1 = moment(sampleDateString);

  test('getUtcNowAndDeviceTimezone', () => {
    // Arrange
    jest.spyOn(MomentFunctions, 'utc').mockReturnValue(sampleMoment1);
    jest.spyOn(LocalizeFunctions, 'getTimeZone').mockReturnValue(fakeTimezone);

    // Act
    const response = getUtcNowAndDeviceTimezone();

    // Assert
    expect(MomentFunctions.utc).toHaveBeenCalledTimes(1);
    expect(LocalizeFunctions.getTimeZone).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      timestamp: '2024-01-01T00:00:00.000',
      timezone: 'America/Toronto',
    });
  });

  test('momentToDateStr', () => {
    // Arrange
    // Act
    const response = momentToDateStr(sampleMoment1, DateFormat.DDMM);
    // Assert
    expect(response).toEqual('01/01');
  });

  test('getDayBoundsOfDate', () => {
    // Arrange
    // Act
    const response = getDayBoundsOfDate(sampleMoment1);
    // Assert
    expect(response).toEqual({
      startOfDay: sampleMoment1.clone().startOf('day'),
      endOfDay: sampleMoment1.clone().endOf('day'),
    });
  });
});
