// Mocked Functions
import * as Apis from '@services/api/blueprints/user/Api';
import * as DateFunctions from '@services/date/Functions';
import logger from '@utils/Logger';
import {runSyncProcess} from '@services/db/sync/SyncProcess';
// Test Functions
import {
  handleLogin,
  handleCreateAccount,
} from '@services/api/blueprints/user/Functions';
// Data
import {mockNavigation} from '../../../../Objects';
import {SwaggerValidationError} from '@services/api/Types';
// Types
import {TimestampTimezone} from '@services/date/Type';

const mockParams = {
  email: 'test@gmail.com',
  password: 'password',
  navigation: mockNavigation,
  isConnected: true,
};
const testErrorMesssage = 'test error';
const validationError = new SwaggerValidationError(testErrorMesssage);
const loggedErrorMessage = `Error: ${testErrorMesssage}`;
const timestampTimezone: TimestampTimezone = {
  timestamp: 'test',
  timezone: 'test',
};

// Mock the api functions
jest.mock('@services/api/blueprints/clientSessionEvent/Functions', () => ({
  handleClientSessionEvent: jest.fn(),
}));
jest.mock('@services/api/blueprints/user/Api', () => ({
  loginUser: jest.fn(),
  createUser: jest.fn(),
}));
jest.mock('@services/db/sync/SyncProcess', () => ({
  runSyncProcess: jest.fn(),
}));
jest.mock('@services/api/blueprints/device/Functions', () => ({
  retrieveOrRegisterDeviceId: jest.fn(),
}));

describe('User Functions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test handleLogin
  it('handleLogin not connected', async () => {
    // Arrange
    const params = {
      ...mockParams,
      isConnected: false,
    };
    jest.spyOn(Apis, 'loginUser');
    // Act
    handleLogin(params);
    // Assert
    expect(Apis.loginUser).toHaveBeenCalledTimes(0);
  });
  it('handleLogin sucessful', async () => {
    // Arrange
    const params = mockParams;
    jest.spyOn(Apis, 'loginUser').mockResolvedValueOnce({} as any);
    // Act
    await handleLogin(params);
    // Assert
    expect(Apis.loginUser).toHaveBeenCalledTimes(1);
    expect(Apis.loginUser).toHaveBeenCalledWith({
      email: mockParams.email,
      password: mockParams.password,
    });
    expect(runSyncProcess).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('App', {
      screen: 'Home',
    });
  });
  it('handleLogin failure', async () => {
    // Arrange
    const params = mockParams;
    jest.spyOn(Apis, 'loginUser').mockResolvedValueOnce(validationError);
    // Act
    await handleLogin(params);
    // Assert
    expect(Apis.loginUser).toHaveBeenCalledTimes(1);
    expect(Apis.loginUser).toHaveBeenCalledWith({
      email: mockParams.email,
      password: mockParams.password,
    });
    expect(runSyncProcess).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(loggedErrorMessage);
  });

  // Test handleCreateAccount
  it('handleCreateAccount not connected', async () => {
    // Arrange
    const params = {
      ...mockParams,
      isConnected: false,
    };
    // Act
    handleCreateAccount(params);
    // Assert
    expect(Apis.createUser).toHaveBeenCalledTimes(0);
  });
  it('handleCreateAccount sucessful', async () => {
    // Arrange
    const params = mockParams;
    jest.spyOn(Apis, 'createUser').mockResolvedValueOnce();
    // Spy on getCurrentTimestampTimezone
    jest
      .spyOn(DateFunctions, 'getCurrentTimestampTimezone')
      .mockReturnValueOnce(timestampTimezone);
    // Act
    await handleCreateAccount(params);
    // Assert
    expect(Apis.createUser).toHaveBeenCalledTimes(1);
    expect(Apis.loginUser).toHaveBeenCalledWith({
      email: mockParams.email,
      password: mockParams.password,
    });
    expect(runSyncProcess).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('App', {
      screen: 'Home',
    });
  });
  it('handleCreateAccount failure', async () => {
    // Arrange
    const params = mockParams;
    jest.spyOn(Apis, 'createUser').mockResolvedValueOnce(validationError);
    // Spy on getCurrentTimestampTimezone
    jest
      .spyOn(DateFunctions, 'getCurrentTimestampTimezone')
      .mockReturnValueOnce(timestampTimezone);
    // Act
    await handleCreateAccount(params);
    // Assert
    expect(Apis.createUser).toHaveBeenCalledTimes(1);
    expect(runSyncProcess).toHaveBeenCalledTimes(0);
    expect(Apis.loginUser).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(loggedErrorMessage);
  });
});
