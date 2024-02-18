// Mocked Functions
import {insertBodyStat} from '@services/db/bodyStat/Functions';
import * as statApiFunctions from '@services/api/blueprints/bodyStat/Api';
import * as asyncStorageFunctions from '@services/asyncStorage/Functions';
import logger from '@utils/Logger';
// Test Functions
import {
  createNewBodyStat,
  getUserStats,
} from '@services/api/blueprints/bodyStat/Functions';
// Data
import {sampleStat, mockNavigation} from '../../../../Objects';
import {SwaggerValidationError} from '@services/api/Types';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('67f6127d-13cc-4c27-b91f-2b1f83c48eeb'),
}));
jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getCurrentTimestampTimezone: jest.fn().mockReturnValue({
    timestamp: '2025-01-01T00:00:00.000',
    timezone: 'UTC',
  }),
}));
jest.mock('@services/db/bodyStat/Functions', () => ({
  ...jest.requireActual('@services/db/bodyStat/Functions'),
  insertBodyStat: jest.fn(),
}));

describe('Body BodyStat Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createNewBodyStat', async () => {
    // Arrange
    const params = {
      value: sampleStat.value,
      navigation: mockNavigation,
      bodyStatType: sampleStat.stat_type,
      unitValue: sampleStat.unit,
    };
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockResolvedValue(1);

    // Act
    await createNewBodyStat(params);

    // Assert
    expect(insertBodyStat).toHaveBeenCalledTimes(1);
    expect(insertBodyStat).toHaveBeenCalledWith([
      {
        body_stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
        unit: params.unitValue,
        stat_type: params.bodyStatType,
        user_id: 1,
        value: params.value,
        created_at: sampleStat.created_at,
        timezone: sampleStat.timezone,
      },
    ]);
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  test('createNewBodyStat with error', async () => {
    // Arrange
    const params = {
      value: sampleStat.value,
      navigation: mockNavigation,
      bodyStatType: sampleStat.stat_type,
      unitValue: sampleStat.unit,
    };
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockRejectedValue('');
    // Act
    await createNewBodyStat(params);

    // Assert
    expect(insertBodyStat).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledWith('Error: ');
  });

  test('getUserStats', async () => {
    // Arrange
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockResolvedValue(1);
    jest.spyOn(statApiFunctions, 'getStats').mockResolvedValue([sampleStat]);
    const bodyStatType = sampleStat.stat_type;
    // Act
    const result = await getUserStats({bodyStatType: bodyStatType});
    // Assert
    expect(result).toEqual([sampleStat]);
  });

  test('getUserStats with validation error', async () => {
    // Arrange
    const validationMessage = 'test';
    const validationError = new SwaggerValidationError(validationMessage);
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockResolvedValue(1);
    jest.spyOn(statApiFunctions, 'getStats').mockResolvedValue(validationError);
    const bodyStatType = sampleStat.stat_type;
    // Act
    await getUserStats({bodyStatType: bodyStatType});
    // Assert
    expect(logger.error).toHaveBeenCalledWith(`Error: ${validationMessage}`);
  });

  test('getUserStats with error', async () => {
    // Arrange
    // Cause an error by rejecting the promise
    jest.spyOn(asyncStorageFunctions, 'getUserDetails').mockRejectedValue('');
    const bodyStatType = sampleStat.stat_type;
    // Act
    const result = await getUserStats({bodyStatType: bodyStatType});
    // Assert
    expect(logger.error).toHaveBeenCalledWith('Error: ');
    expect(result).toEqual(undefined);
  });
});
