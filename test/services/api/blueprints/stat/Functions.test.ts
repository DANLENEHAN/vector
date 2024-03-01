// Mocked Functions
import {insertBodyStat} from '@services/db/bodyStat/Functions';
import * as statApiFunctions from '@services/api/blueprints/bodyStat/Api';
import logger from '@utils/Logger';
// Test Functions
import {
  createNewBodyStat,
  getUserStats,
} from '@services/api/blueprints/bodyStat/Functions';
import * as UserFunctions from '@services/db/user/Functions';
// Data
import {sampleStat, mockNavigation, sampleUser} from '../../../../Objects';
import {SwaggerValidationError} from '@services/api/Types';
import {QuerySchema} from '@services/api/swagger/data-contracts';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mockedUuid'),
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

  const queryObject: QuerySchema = {
    filters: {
      stat_type: {
        eq: sampleStat.stat_type,
      },
      user_id: {
        eq: sampleUser.user_id,
      },
    },
    sort: ['created_at:desc'],
  };

  test('createNewBodyStat', async () => {
    // Arrange
    const params = {
      value: sampleStat.value,
      unitValue: sampleStat.unit,
      statType: sampleStat.stat_type,
      onSuccessfulCreate: mockNavigation.goBack,
    };
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValue(sampleUser);

    // Act
    await createNewBodyStat(params);

    // Assert
    expect(insertBodyStat).toHaveBeenCalledTimes(1);
    expect(insertBodyStat).toHaveBeenCalledWith([
      {
        body_stat_id: 'mockedUuid',
        unit: params.unitValue,
        stat_type: params.statType,
        user_id: sampleUser.user_id,
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
      statType: sampleStat.stat_type,
      unitValue: sampleStat.unit,
      onSuccessfulCreate: mockNavigation.goBack,
    };
    jest.spyOn(UserFunctions, 'getUser').mockRejectedValue(null);
    // Act
    await createNewBodyStat(params);

    // Assert
    expect(insertBodyStat).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledWith('Error: null');
  });

  test('createNewBodyStat getUser returns null', async () => {
    // Arrange
    const params = {
      value: sampleStat.value,
      navigation: mockNavigation,
      statType: sampleStat.stat_type,
      unitValue: sampleStat.unit,
      onSuccessfulCreate: mockNavigation.goBack,
    };
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValue(null);
    // Act
    await createNewBodyStat(params);

    // Assert
    expect(insertBodyStat).toHaveBeenCalledTimes(0);
    expect(logger.warn).toHaveBeenCalledWith(
      'Unable to retrieve user will not insert body stat.',
    );
  });

  test('getUserStats', async () => {
    // Arrange
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValue(sampleUser);
    jest.spyOn(statApiFunctions, 'getStats').mockResolvedValue([sampleStat]);
    const bodyStatType = sampleStat.stat_type;
    // Act
    const result = await getUserStats({bodyStatType: bodyStatType});
    // Assert
    expect(statApiFunctions.getStats).toHaveBeenCalledTimes(1);
    expect(statApiFunctions.getStats).toHaveBeenCalledWith(queryObject);
    expect(result).toEqual([sampleStat]);
  });

  test('getUserStats with validation error', async () => {
    // Arrange
    const validationMessage = 'test';
    const validationError = new SwaggerValidationError(validationMessage);
    jest.spyOn(UserFunctions, 'getUser').mockResolvedValue(sampleUser);
    jest.spyOn(statApiFunctions, 'getStats').mockResolvedValue(validationError);
    const bodyStatType = sampleStat.stat_type;
    // Act
    const response = await getUserStats({bodyStatType: bodyStatType});
    // Assert
    expect(statApiFunctions.getStats).toHaveBeenCalledTimes(1);
    expect(statApiFunctions.getStats).toHaveBeenCalledWith(queryObject);
    expect(logger.error).toHaveBeenCalledWith(`Error: ${validationMessage}`);
    expect(response).toEqual(undefined);
  });

  test('getUserStats with error', async () => {
    // Arrange
    // Cause an error by rejecting the promise
    jest.spyOn(UserFunctions, 'getUser').mockRejectedValue(null);
    const bodyStatType = sampleStat.stat_type;
    // Act
    const response = await getUserStats({bodyStatType: bodyStatType});
    // Assert
    expect(logger.error).toHaveBeenCalledWith('Error: null');
    expect(response).toEqual(undefined);
  });
});
