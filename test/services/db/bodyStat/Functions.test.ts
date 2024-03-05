import {insertBodyStat} from '@services/db/bodyStat/Functions';
import * as DbFunctions from '@services/db/Operations';
import {BodyStatType} from '@services/api/swagger/data-contracts';
import {BodyStatCreateSchema} from '@services/api/swagger/data-contracts';

describe('Test bodyStat functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('insertBodyStat works', async () => {
    // Arrange
    const testStats = [
      {
        body_stat_id: '1',
        user_id: '1',
        value: 1,
        unit: 'kg',
        stat_type: BodyStatType.Weight,
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
      {
        body_stat_id: '2',
        user_id: '1',
        value: 2,
        unit: 'cm',
        stat_type: BodyStatType.Height,
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
    ] as BodyStatCreateSchema[];
    const mockInsertRows = jest
      .spyOn(DbFunctions, 'insertRows')
      .mockResolvedValueOnce();
    // Act
    await insertBodyStat(testStats);
    // Assert
    expect(mockInsertRows).toHaveBeenCalledTimes(1);
    expect(mockInsertRows).toHaveBeenCalledWith('body_stat', testStats);
  });
});
