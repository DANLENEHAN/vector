//Mocked Functions
import {HandleSwaggerValidationError} from '@services/api/Functions';
// Test Functions
import {getStats} from '@services/api/blueprints/stat/Api';

// Mocking the Stat Api Class
jest.mock('@services/api/swagger/Stat', () => ({
  Stat: jest.fn().mockImplementation(() => ({
    postStat: jest
      .fn()
      // For first test
      .mockResolvedValueOnce({status: 201, data: {Test: true}})
      // For second test
      .mockResolvedValueOnce({status: 400, data: {}}),
  })),
}));

jest.mock('@services/api/Functions', () => ({
  ...jest.requireActual('@services/api/Functions'),
  HandleSwaggerValidationError: jest.fn(),
}));

describe('Stat Api Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getStats', async () => {
    // Arrange
    const params = {};
    // Act
    const result = await getStats(params);
    // Assert
    expect(HandleSwaggerValidationError).toHaveBeenCalledTimes(0);
    expect(result).toEqual({Test: true});
  });

  test('getStats with error', async () => {
    // Arrange
    const params = {};
    // Act
    await getStats(params);
    // Assert
    expect(HandleSwaggerValidationError).toHaveBeenCalledTimes(1);
    expect(HandleSwaggerValidationError).toHaveBeenCalledWith(
      'Unexpected status code: 400',
      {400: null},
    );
  });
});
