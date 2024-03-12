// Mocked Functions
import * as UserApiFunctions from '@services/api/blueprints/user/Api';
import * as DateFunctions from '@services/date/Functions';
import logger from '@utils/Logger';
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
import {
  DateFormat,
  FitnessGoal,
  Gender,
  HeightUnit,
  ProfileStatus,
  UserCreateSchema,
  WeightUnit,
} from '@services/api/swagger/data-contracts';
import * as SystemEventsFunctions from '@services/system/SystemEvents';
import {AppEntryType} from '@services/system/Types';

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
jest.mock('@services/db/user/Functions');
jest.mock('@services/api/blueprints/user/Api', () => ({
  loginUser: jest.fn(),
  createUser: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fakeUuid'),
}));
jest.mock('@services/system/SystemEvents.ts', () => ({
  ...jest.requireActual('@services/system/SystemEvents.ts'),
  appEntryCallback: jest.fn(),
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
    jest.spyOn(UserApiFunctions, 'loginUser');
    // Act
    handleLogin(params);
    // Assert
    expect(UserApiFunctions.loginUser).toHaveBeenCalledTimes(0);
  });

  it('handleLogin sucessful', async () => {
    // Arrange
    const params = mockParams;
    jest.spyOn(UserApiFunctions, 'loginUser').mockResolvedValueOnce('fakeUuid');
    // Act
    await handleLogin(params);
    // Assert
    expect(UserApiFunctions.loginUser).toHaveBeenCalledTimes(1);
    expect(UserApiFunctions.loginUser).toHaveBeenCalledWith({
      email: mockParams.email,
      password: mockParams.password,
    });
    expect(SystemEventsFunctions.appEntryCallback).toHaveBeenCalledTimes(1);
    expect(SystemEventsFunctions.appEntryCallback).toHaveBeenCalledWith(
      AppEntryType.LoginAuthed,
      'fakeUuid',
    );
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('App', {
      screen: 'Home',
    });
  });

  it('handleLogin failure', async () => {
    // Arrange
    const params = mockParams;
    jest
      .spyOn(UserApiFunctions, 'loginUser')
      .mockResolvedValueOnce(validationError);
    // Act
    await handleLogin(params);
    // Assert
    expect(UserApiFunctions.loginUser).toHaveBeenCalledTimes(1);
    expect(UserApiFunctions.loginUser).toHaveBeenCalledWith({
      email: mockParams.email,
      password: mockParams.password,
    });
    expect(SystemEventsFunctions.appEntryCallback).toHaveBeenCalledTimes(0);
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
    expect(UserApiFunctions.createUser).toHaveBeenCalledTimes(0);
  });
  it('handleCreateAccount sucessful', async () => {
    // Arrange
    const params = mockParams;
    const userObject: UserCreateSchema = {
      age: 125,
      birthday: '1997-05-18',
      created_at: 'test',
      date_format_pref: DateFormat.ValueDMY,
      email: 'test@gmail.com',
      first_name: 'test',
      gender: Gender.Male,
      goal: FitnessGoal.BuildMuscle,
      height_unit_pref: HeightUnit.Cm,
      language: 'en',
      last_name: 'Lenehan',
      password: 'password',
      phone_number: '+447308821533',
      premium: false,
      status: ProfileStatus.Active,
      timezone: 'test',
      user_id: 'fakeUuid',
      username: 'danlen97',
      weight_unit_pref: WeightUnit.Kg,
    };

    jest.spyOn(UserApiFunctions, 'loginUser').mockResolvedValueOnce('fakeUuid');
    jest.spyOn(UserApiFunctions, 'createUser').mockResolvedValueOnce();
    // Spy on getUtcNowAndDeviceTimezone
    jest
      .spyOn(DateFunctions, 'getUtcNowAndDeviceTimezone')
      .mockReturnValueOnce(timestampTimezone);
    // Act
    await handleCreateAccount(params);
    // Assert
    expect(UserApiFunctions.createUser).toHaveBeenCalledTimes(1);
    expect(UserApiFunctions.createUser).toHaveBeenCalledWith(userObject);
    expect(UserApiFunctions.loginUser).toHaveBeenCalledWith({
      email: mockParams.email,
      password: mockParams.password,
    });
    expect(SystemEventsFunctions.appEntryCallback).toHaveBeenCalledTimes(1);
    expect(SystemEventsFunctions.appEntryCallback).toHaveBeenCalledWith(
      AppEntryType.CreateAccAuthed,
      'fakeUuid',
    );
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('App', {
      screen: 'Home',
    });
  });
  it('handleCreateAccount failure', async () => {
    // Arrange
    const params = mockParams;
    jest
      .spyOn(UserApiFunctions, 'createUser')
      .mockResolvedValueOnce(validationError);
    // Spy on getUtcNowAndDeviceTimezone
    jest
      .spyOn(DateFunctions, 'getUtcNowAndDeviceTimezone')
      .mockReturnValueOnce(timestampTimezone);
    // Act
    await handleCreateAccount(params);
    // Assert
    expect(UserApiFunctions.createUser).toHaveBeenCalledTimes(1);
    expect(SystemEventsFunctions.appEntryCallback).toHaveBeenCalledTimes(0);
    expect(UserApiFunctions.loginUser).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(loggedErrorMessage);
  });
});
