// Functions
import {loginUser, createUser} from '@services/api/blueprints/user/Api';
import {SwaggerValidationError} from '@services/api/Types';
import {Keyboard} from 'react-native';
import {getUtcNowAndDeviceTimezone} from '@services/date/Functions';
import {getUser, insertUser} from '@services/db/user/Functions';
import {appEntryCallback} from '@services/system/SystemEvents';
import {v4 as uuid4} from 'uuid';
// Types
import {AxiosResponse} from 'axios';
import {TimestampTimezone} from '@services/date/Type';
import {
  DateFormat,
  Gender,
  FitnessGoal,
  HeightUnit,
  WeightUnit,
  ProfileStatus,
  UserCreateSchema,
} from '@services/api/swagger/data-contracts';
import {timestampFields} from '@shared/Constants';
import {AppEntryType} from '@services/system/Types';
// Services
import {UserApi} from '@services/api/ApiService';
import logger from '@utils/Logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';

/**
 * Interface for the login parameters.
 *
 * @interface LoginParams
 * @property {string} email  The email of the user.
 * @property {string} password  The password of the user.
 * @property {any} navigation  The navigation object.
 * @property {boolean} isConnected  Whether the user is connected to the internet.
 *
 */
interface LoginParams {
  email: string;
  password: string;
  navigation: any;
  isConnected: boolean;
}

/**
 * Function to handle the login of a user.
 *
 * @function handleLogin
 * @param {LoginParams} params  The parameters for handling the login.
 * @returns {Promise<void>} A promise that resolves when the user is successfully
 * logged in.
 */
export const handleLogin = async (
  params: LoginParams,
): Promise<string | void> => {
  if (!params.isConnected) {
    return;
  }
  logger.info('Logging in.');
  Keyboard.dismiss();
  let response = await loginUser({
    email: params.email,
    password: params.password,
  });
  if (response instanceof SwaggerValidationError) {
    logger.error(`Error: ${response.message}`);
    return response.message;
  }
  logger.info('Login successful, navigating to home screen.');
  params.navigation.navigate('App', {screen: 'Home'});
  appEntryCallback(AppEntryType.LoginAuthed, response);
};

/**
 * Interface for the signup parameters.
 *
 * @interface SignupParams
 * @property {string} email  The email of the user.
 * @property {string} password  The password of the user.
 * @property {any} navigation  The navigation object.
 * @property {boolean} isConnected  Whether the user is connected to the internet.
 */
interface SignupParams {
  email: string;
  password: string;
  navigation: any;
  isConnected: boolean;
}

/**
 * Function to handle the creation of a new user.
 *
 * @function handleCreateAccount
 * @param {SignupParams} params  The parameters for handling the creation of a new user.
 * @returns {Promise<void>} A promise that resolves when the user is successfully created.
 */
export const handleCreateAccount = async (
  params: SignupParams,
): Promise<string | void> => {
  if (!params.isConnected) {
    return;
  }
  const timestampTimezone: TimestampTimezone = getUtcNowAndDeviceTimezone();
  const userObject: UserCreateSchema = {
    // NOTE: Remove these hard-coded values when the UI is implemented fully
    user_id: uuid4(),
    email: params.email,
    password: params.password,
    age: 125,
    birthday: '1997-05-18',
    date_format_pref: DateFormat.ValueDMY,
    first_name: `${params.email.split('@')[0]}`,
    gender: Gender.Male,
    goal: FitnessGoal.BuildMuscle,
    height_unit_pref: HeightUnit.Cm,
    language: 'en',
    last_name: 'Lenehan',
    phone_number: '+447308821533',
    premium: false,
    status: ProfileStatus.Active,
    username: 'danlen97',
    weight_unit_pref: WeightUnit.Kg,
    [timestampFields.createdAt]: timestampTimezone.timestamp,
    [timestampFields.timezone]: timestampTimezone.timezone,
  };
  let createResponse = await createUser(userObject);
  if (createResponse instanceof SwaggerValidationError) {
    logger.error(`Error: ${createResponse.message}`);
    return createResponse.message;
  } else {
    logger.info('Account creation successful, logging in.');
    await insertUser(userObject);
    const loginResponse = await loginUser({
      email: params.email,
      password: params.password,
    });
    if (loginResponse instanceof SwaggerValidationError) {
      logger.error(`Error: ${loginResponse.message}`);
      return loginResponse.message;
    } else {
      params.navigation.navigate('App', {screen: 'Home'});
      appEntryCallback(AppEntryType.CreateAccAuthed, loginResponse);
    }
  }
};

/**
 * Asynchronously retrieves an existing user from the local database or requests it from an external API.
 * This function first attempts to fetch the user from the local database by calling the getUser function.
 * If a user is found locally, it is immediately returned. If not, the function then attempts to retrieve the
 * active user's ID from AsyncStorage using the AsyncStorageKeys.ActiveUser key. With the active user ID, it makes
 * an external API call to UserApi.getUser to fetch the user data. If the API call is successful and returns user data,
 * this data is then inserted into the local database via the insertUser function before the user object is returned.
 * If no user can be retrieved either from the local database or the external API, or if any step in the process fails,
 * the function logs an error and returns null, indicating the absence of a retrievable user.
 *
 * @returns {Promise<UserCreateSchema | null>} A promise that resolves to a UserCreateSchema object if a user is
 *                                             successfully retrieved or requested and inserted into the local database.
 *                                             If no user is found or an error occurs at any stage of the process,
 *                                             the promise resolves to null. Error situations are logged for debugging.
 */
export const retrieveOrRequestUser =
  async (): Promise<UserCreateSchema | null> => {
    const user: UserCreateSchema | null = await getUser();
    if (user !== null) {
      return user;
    }
    const activeUserId: string | null = await AsyncStorage.getItem(
      AsyncStorageKeys.ActiveUser,
    );
    if (activeUserId !== null) {
      try {
        const response: AxiosResponse<UserCreateSchema> = await UserApi.getUser(
          activeUserId,
        );
        if (response.data) {
          const user: UserCreateSchema = response.data;
          await insertUser(user);
          return user;
        }
      } catch (error) {
        logger.error("Logged In User unable to retrieve it's data.");
      }
    }
    return null;
  };
