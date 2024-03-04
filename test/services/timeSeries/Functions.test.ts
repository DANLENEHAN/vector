import {
  BodyStatCreateSchema,
  MoodCreateSchema,
  WeightUnit,
} from '@services/api/swagger/data-contracts';
import {
  transformData,
  convertDataPoint,
  convertData,
  convertDataPointDate,
  convertDataDate,
  filterDataByDates,
  getDataForPeriod,
  getIntervals,
  getPeriodData,
} from '@services/timeSeries/Functions';
import {syncDbTables} from '@shared/Constants';
import {parseDate} from '@services/date/Functions';
import {TimestampFormat} from '@shared/Enums';
import moment from 'moment';

describe('Time Series Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transformData should return the expected output', () => {
    // Arrange
    const table = syncDbTables.moodTable;
    const data = [
      {
        mood_id: '1',
        value: 3,
        created_at: '2021-07-01T00:00:00.000Z',
      },
      {
        mood_id: '2',
        value: 4,
        created_at: '2021-07-01T01:00:00.000Z',
      },
    ] as MoodCreateSchema[];
    const expectedOutput = [
      {
        value: 3,
        date: '2021-07-01T00:00:00.000Z',
        unit: 'mood unit',
      },
      {
        value: 4,
        date: '2021-07-01T01:00:00.000Z',
        unit: 'mood unit',
      },
    ];
    // Act
    const result = transformData({table, data});
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('TransformData works when called with stats', () => {
    // Arrange
    const table = syncDbTables.bodyStatTable;
    const data = [
      {
        body_stat_id: '1',
        value: 3,
        created_at: '2021-07-01T00:00:00.000Z',
        unit: 'kg',
      },
      {
        body_stat_id: '2',
        value: 4,
        created_at: '2021-07-01T01:00:00.000Z',
        unit: 'kg',
      },
    ] as BodyStatCreateSchema[];
    const expectedOutput = [
      {
        value: 3,
        date: '2021-07-01T00:00:00.000Z',
        unit: 'kg',
      },
      {
        value: 4,
        date: '2021-07-01T01:00:00.000Z',
        unit: 'kg',
      },
    ];
    // Act
    const result = transformData({table, data});
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('convertDataPoint should return the expected output', () => {
    // Arrange
    const dataPoint = {
      value: 3,
      date: '2021-07-01T00:00:00.000Z',
      unit: 'kg',
    };
    const expectedOutput = {
      value: 6.61,
      date: '2021-07-01T00:00:00.000Z',
      unit: 'lbs',
    };
    // Act
    const result = convertDataPoint(dataPoint, WeightUnit.Lbs);
    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it('convertDataPoint should same value for same unit', () => {
    // Arrange
    const dataPoint = {
      value: 3,
      date: '2021-07-01T00:00:00.000Z',
      unit: 'kg',
    };
    // Act
    const result = convertDataPoint(dataPoint, WeightUnit.Kg);
    // Assert
    expect(result).toEqual(dataPoint);
  });

  it('convertData works as expected', () => {
    // Arrange
    const data = [
      {
        value: 3,
        date: '2021-07-01T00:00:00.000Z',
        unit: 'kg',
      },
      {
        value: 4,
        date: '2021-07-01T01:00:00.000Z',
        unit: 'kg',
      },
    ];
    const expectedOutput = [
      {
        value: 6.61,
        date: '2021-07-01T00:00:00.000Z',
        unit: 'lbs',
      },
      {
        value: 8.82,
        date: '2021-07-01T01:00:00.000Z',
        unit: 'lbs',
      },
    ];
    // Act
    const result = convertData(data, WeightUnit.Lbs);
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('convertDataPointDate works as expected', () => {
    // Arrange
    const dataPoint = {
      value: 3,
      date: '2021-07-01T00:00:00.000Z',
      unit: 'kg',
    };
    const expectedOutput = {
      value: 3,
      startDate: 1625097600000,
      endDate: 1625097600000,
      numberOfDataPoints: 1,
      axisLabel: '',
      unit: 'kg',
      label: '',
      index: 0,
    };
    // Act
    const result = convertDataPointDate(dataPoint);
    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it('convertDataDate works as expected', () => {
    // Arrange
    const data = [
      {
        value: 3,
        date: '2021-07-01T00:00:00.000Z',
        unit: 'kg',
      },
      {
        value: 4,
        date: '2021-07-01T01:00:00.000Z',
        unit: 'kg',
      },
    ];
    const expectedOutput = [
      {
        value: 3,
        startDate: 1625097600000,
        endDate: 1625097600000,
        numberOfDataPoints: 1,
        axisLabel: '',
        unit: 'kg',
        label: '',
        index: 0,
      },
      {
        value: 4,
        startDate: 1625101200000,
        endDate: 1625101200000,
        numberOfDataPoints: 1,
        axisLabel: '',
        unit: 'kg',
        label: '',
        index: 1,
      },
    ];
    // Act
    const result = convertDataDate(data);
    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it('filterDataByDates works as expected', () => {
    // Arrange
    const startDate = 1625097600000;
    const endDate = startDate + 10;
    const data = [
      {
        value: 3,
        startDate: startDate,
        endDate: startDate,
        unit: 'kg',
        label: '',
        numberOfDataPoints: 1,
        axisLabel: '',
        index: 0,
      }, // Kept
      {
        value: 4,
        startDate: endDate + 10,
        endDate: endDate + 10,
        unit: 'kg',
        label: '',
        numberOfDataPoints: 1,
        axisLabel: '',
        index: 1,
      }, // Filtered out
    ];
    const expectedOutput = [
      {
        value: 3,
        startDate: startDate,
        endDate: startDate,
        unit: 'kg',
        label: '',
        numberOfDataPoints: 1,
        axisLabel: '',
        index: 0,
      },
    ];
    // Act
    const result = filterDataByDates(data, startDate, endDate);
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('getDataForPeriod works as expected', () => {
    // Arrange
    const data = [
      {
        value: 3,
        startDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        unit: 'kg',
        label: '',
        index: 0,
        axisLabel: '',
        numberOfDataPoints: 1,
      },
      {
        value: 4,
        startDate: parseDate(
          '2021-07-02T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-02T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        unit: 'kg',
        label: '',
        index: 1,
        axisLabel: '',
        numberOfDataPoints: 1,
      },
    ];
    const period = 'day';
    const expectedOutput = [
      {
        value: 3,
        startDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        unit: 'kg',
        label: '',
        index: 0,
        axisLabel: '',
        numberOfDataPoints: 1,
      },
    ];
    // Act
    const result = getDataForPeriod(
      data,
      period,
      moment('2021-07-01T01:00:00.000Z', TimestampFormat.YYYYMMDDHHMMssSSS),
    );
    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it('getIntervals works as expected for a day', () => {
    // Arrange
    const period = 'day';
    const targetDate = moment.utc(
      '2021-07-01T04:15:00.000Z',
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    const expectedOutput = [
      {
        startDate: parseDate(
          '2021-07-01T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T02:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T02:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T03:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T03:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T04:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T04:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T05:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T05:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T06:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T06:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T07:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T07:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T08:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T08:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T09:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T09:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T10:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T10:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T11:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T11:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T12:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T12:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T13:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T13:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T14:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T14:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T15:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T15:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T16:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T16:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T17:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T17:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T18:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T18:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T19:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T19:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T20:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T20:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T21:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T21:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T22:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T22:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T23:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
      {
        startDate: parseDate(
          '2021-07-01T23:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-02T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
      },
    ];
    // Act
    const result = getIntervals(period, targetDate);
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('getPeriodData works as expected for a week', () => {
    // Arrange
    const data = [
      {
        value: 3,
        startDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: '',
        numberOfDataPoints: 1,
        unit: 'kg',
        label: '',
        index: 0,
      },
      {
        value: 4,
        startDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-01T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: '',
        numberOfDataPoints: 1,
        unit: 'kg',
        label: '',
        index: 1,
      },
      {
        value: 5,
        startDate: parseDate(
          '2021-07-03T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-03T01:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: '',
        numberOfDataPoints: 1,
        unit: 'kg',
        label: '',
        index: 2,
      },
    ];
    const period = 'week';
    const targetDate = moment.utc(
      '2021-07-07T04:15:00.000Z',
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    const intervals = getIntervals(period, targetDate);

    const expectedOutput = [
      {
        value: 3.5,
        startDate: parseDate(
          '2021-07-01T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-02T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Thu',
        numberOfDataPoints: 2,
        unit: 'kg',
        label: 'Thu',
        index: 0,
      },
      {
        value: null,
        startDate: parseDate(
          '2021-07-02T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-03T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Fri',
        numberOfDataPoints: 0,
        unit: 'kg',
        label: 'Fri',
        index: 1,
      },
      {
        value: 5,
        startDate: parseDate(
          '2021-07-03T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-04T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Sat',
        numberOfDataPoints: 1,
        unit: 'kg',
        label: 'Sat',
        index: 2,
      },
      {
        value: null,
        startDate: parseDate(
          '2021-07-04T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-05T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Sun',
        numberOfDataPoints: 0,
        unit: 'kg',
        label: 'Sun',
        index: 3,
      },
      {
        value: null,
        startDate: parseDate(
          '2021-07-05T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-06T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Mon',
        numberOfDataPoints: 0,
        unit: 'kg',
        label: 'Mon',
        index: 4,
      },
      {
        value: null,
        startDate: parseDate(
          '2021-07-06T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-07T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Tue',
        numberOfDataPoints: 0,
        unit: 'kg',
        label: 'Tue',
        index: 5,
      },
      {
        value: null,
        startDate: parseDate(
          '2021-07-07T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        endDate: parseDate(
          '2021-07-08T00:00:00.000Z',
          TimestampFormat.YYYYMMDDHHMMssSSS,
        ),
        axisLabel: 'Wed',
        numberOfDataPoints: 0,
        unit: 'kg',
        label: 'Wed',
        index: 6,
      },
    ];
    // Act
    const result = getPeriodData(data, intervals, period, 'kg');
    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
