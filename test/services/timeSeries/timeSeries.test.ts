import {generateGraphData} from '@services/timeSeries/timeSeries';
import {
  MoodCreateSchema,
  WeightUnit,
} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {emptyGraphPeriodData} from '@services/timeSeries/Constants';
import * as timeSeriesFunctions from '@services/timeSeries/Functions';
import {statisticType} from '@services/timeSeries/Types';

describe('Test timeSeries functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('generateGraphData should return the expected output when no data', () => {
    // Arrange
    const data = [] as MoodCreateSchema[];
    const table = syncDbTables.moodTable;
    // Act
    const result = generateGraphData({
      data: data,
      table: table,
      statType: statisticType.mean,
    });
    // Assert
    expect(result).toEqual(emptyGraphPeriodData);
  });

  test('generateGraphData should call correct functions', () => {
    // Arrange
    const data = [
      {
        mood_id: '1',
        user_id: '1',
        value: 1,
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
    ] as MoodCreateSchema[];
    const table = syncDbTables.moodTable;
    const targetUnit = WeightUnit.Lbs;

    const transformDataSpy = jest
      .spyOn(timeSeriesFunctions, 'transformData')
      .mockReturnValue(data as any);
    const convertDataSpy = jest
      .spyOn(timeSeriesFunctions, 'convertData')
      .mockReturnValue(data as any);
    const convertDataDateSpy = jest
      .spyOn(timeSeriesFunctions, 'convertDataDate')
      .mockReturnValue(data as any);
    const getGraphDataSpy = jest
      .spyOn(timeSeriesFunctions, 'getGraphData')
      .mockReturnValue([] as any);
    // Act
    generateGraphData({data, table, statType: statisticType.mean, targetUnit});
    // Assert
    expect(transformDataSpy).toHaveBeenCalledTimes(1);
    expect(transformDataSpy).toHaveBeenCalledWith({data: data, table: table});
    expect(convertDataSpy).toHaveBeenCalledTimes(1);
    expect(convertDataSpy).toHaveBeenCalledWith(data, targetUnit);
    expect(convertDataDateSpy).toHaveBeenCalledTimes(1);
    expect(convertDataDateSpy).toHaveBeenCalledWith(data);
    expect(getGraphDataSpy).toHaveBeenCalledTimes(1);
    expect(getGraphDataSpy).toHaveBeenCalledWith(
      data,
      statisticType.mean,
      undefined,
      targetUnit,
    );
  });

  test('generateGraphData should call correct functions no targetUnit', () => {
    // Arrange
    const data = [
      {
        mood_id: '1',
        user_id: '1',
        value: 1,
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
    ] as MoodCreateSchema[];
    const table = syncDbTables.moodTable;

    const transformDataSpy = jest
      .spyOn(timeSeriesFunctions, 'transformData')
      .mockReturnValue(data as any);
    const convertDataSpy = jest
      .spyOn(timeSeriesFunctions, 'convertData')
      .mockReturnValue(data as any);
    const convertDataDateSpy = jest
      .spyOn(timeSeriesFunctions, 'convertDataDate')
      .mockReturnValue(data as any);
    const getGraphDataSpy = jest
      .spyOn(timeSeriesFunctions, 'getGraphData')
      .mockReturnValue([] as any);
    // Act
    generateGraphData({data: data, table: table, statType: statisticType.mean});
    // Assert
    expect(transformDataSpy).toHaveBeenCalledTimes(1);
    expect(transformDataSpy).toHaveBeenCalledWith({data: data, table: table});
    expect(convertDataSpy).toHaveBeenCalledTimes(0);
    expect(convertDataDateSpy).toHaveBeenCalledTimes(1);
    expect(convertDataDateSpy).toHaveBeenCalledWith(data);
    expect(getGraphDataSpy).toHaveBeenCalledTimes(1);
    expect(getGraphDataSpy).toHaveBeenCalledWith(
      data,
      statisticType.mean,
      undefined,
      undefined,
    );
  });
});
