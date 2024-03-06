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
  } else {
    // If the user has existing data but the device needs to pull it in
    // we won't have the user. If we insert the user after login we avoid
    // having to wait for a sync to get the user data.
    if ((await getUser()) === null) {
      logger.info(
        `Device does not have the user in the DB. Requesting it (user_id)=(${response}) now.`,
      );
      try {
        const user: AxiosResponse<UserCreateSchema> = await UserApi.getUser(
          response,
        );
        if (user.data) {
          await insertUser(user.data);
        }
      } catch (error) {
        logger.error(
          `(user_id)=(${response}); Unable to save user after logging in...`,
        );
      }
    }
    logger.info('Login successful, navigating to home screen.');
    params.navigation.navigate('App', {screen: 'Home'});
    appEntryCallback(AppEntryType.LoginAuthed);
  }
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
      appEntryCallback(AppEntryType.CreateAccAuthed);
    }
  }
};
