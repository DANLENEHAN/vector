// Mocked Functions
import {insertStat} from '@services/db/stat/Functions';
import * as statApiFunctions from '@services/api/blueprints/stat/Api';
import * as asyncStorageFunctions from '@services/asyncStorage/Functions';
import logger from '@utils/Logger';
// Test Functions
import {
  createNewStat,
  getUserStats,
} from '@services/api/blueprints/stat/Functions';
// Data
import {sampleStat} from '../../../../Objects';
import {SwaggerValidationError} from '@services/api/Types';

jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getCurrentTimestampTimezone: jest.fn().mockReturnValue({
    timestamp: '2025-01-01T00:00:00.000',
    timezone: 'UTC',
  }),
}));
jest.mock('@services/db/stat/Functions', () => ({
  ...jest.requireActual('@services/db/stat/Functions'),
  insertStat: jest.fn(),
}));

// Mock navigation with a spy on goBack
const mockNavigation = {
  goBack: jest.fn(),
};

describe('Stat Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createNewStat', async () => {
    // Arrange
    const params = {
      value: sampleStat.value,
      navigation: mockNavigation,
      statType: sampleStat.stat_type,
      unitValue: sampleStat.unit,
    };
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockResolvedValue(1);

    // Act
    await createNewStat(params);

    // Assert
    expect(insertStat).toHaveBeenCalledTimes(1);
    expect(insertStat).toHaveBeenCalledWith([
      {
        unit: params.unitValue,
        stat_type: params.statType,
        user_id: 1,
        value: params.value,
        created_at: sampleStat.created_at,
        timezone: sampleStat.timezone,
      },
    ]);
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  test('createNewStat with error', async () => {
    // Arrange
    const params = {
      value: sampleStat.value,
      navigation: mockNavigation,
      statType: sampleStat.stat_type,
      unitValue: sampleStat.unit,
    };
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockRejectedValue('');
    // Act
    await createNewStat(params);

    // Assert
    expect(insertStat).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledWith('Error: ');
  });

  test('getUserStats', async () => {
    // Arrange
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockResolvedValue(1);
    jest.spyOn(statApiFunctions, 'getStats').mockResolvedValue([sampleStat]);
    const statType = sampleStat.stat_type;
    // Act
    const result = await getUserStats({statType: statType});
    // Assert
    expect(result).toEqual([sampleStat]);
  });

  test('getUserStats with validation error', async () => {
    // Arrange
    const validationMessage = 'test';
    const validationError = new SwaggerValidationError(validationMessage);
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockResolvedValue(1);
    jest.spyOn(statApiFunctions, 'getStats').mockResolvedValue(validationError);
    const statType = sampleStat.stat_type;
    // Act
    await getUserStats({statType: statType});
    // Assert
    expect(logger.error).toHaveBeenCalledWith(`Error: ${validationMessage}`);
  });

  test('getUserStats with error', async () => {
    // Arrange
    // Cause an error by rejecting the promise
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockRejectedValue('');
    const statType = sampleStat.stat_type;
    // Act
    const result = await getUserStats({statType: statType});
    // Assert
    expect(logger.error).toHaveBeenCalledWith('Error: ');
    expect(result).toEqual(undefined);
  });
});
