import {AxiosResponse} from 'axios';
import api from '@services/api/ApiService';
import {
  UserCreateSchema,
  UserGetSchema,
} from '@services/api/swagger/data-contracts';
import {User} from '@services/api/swagger/User';
// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlaskLoginCookie, UserDetails} from '@services/asyncStorage/Types';
// Functions
import {HandleSwaggerValidationError} from '@services/api/Functions';
// Types
import {SwaggerValidationError} from '@services/api/Types';
// Logger
import logger from '@utils/Logger';

const UserApi = new User(api);

/**
 * Function to create a new user.
 *
 * @function createUser
 * @param {UserCreateSchema} userData  The data for creating the user.
 * @returns {Promise<void>} A promise that resolves when the user is successfully created.
 *
 * @example
 * // Example usage:
 * const userData = { /* user data object * / };
 * await createUser(userData);
 */
export const createUser = async (
  userData: UserCreateSchema,
): Promise<void | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<void> = await UserApi.createCreate(userData);

    if (response.status === 204) {
      return Promise.resolve();
    } else {
      return new SwaggerValidationError();
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {400: null, 409: null});
  }
};

/**
 * Function to login a user.
 *
 * @function loginUser
 *
 * @param {Object} data  The data for logging in the user.
 * @param {string} data.email  The email of the user.
 * @param {string} data.password  The password of the user.
 *
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged in.
 */
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<void | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<object> = await UserApi.loginCreate(data);
    if (response.status === 201) {
      const cookieHeader = response.headers['set-cookie'];
      if (cookieHeader) {
        const targetCookie = cookieHeader.find(cookie =>
          cookie.includes('session'),
        );
        const cookieValue = targetCookie?.split(';')[0].split('=')[1].trim();
        if (cookieValue) {
          AsyncStorage.setItem(FlaskLoginCookie, cookieValue);
        }
      }
      const response_data = response.data;
      // If data is null, return an error.
      if (!response_data) {
        return new SwaggerValidationError();
      }
      // Save the user ID to AsyncStorage and return a resolved promise.
      AsyncStorage.setItem(UserDetails, JSON.stringify(response_data));
      return Promise.resolve();
    } else {
      return new SwaggerValidationError();
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {400: null});
  }
};

/**
 * Function to logout a user.
 *
 * @function logoutUser
 *
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
 *
 * @example
 * // Example usage:
 * await logoutUser();
 */
export const logoutUser = async (): Promise<void | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<void> = await UserApi.logoutCreate();

    if (response.status === 204) {
      AsyncStorage.removeItem(FlaskLoginCookie);
      return Promise.resolve();
    } else {
      return new SwaggerValidationError();
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {400: null});
  }
};

/**
 * Function to test if a user is authenticated.
 *
 * @function testAuthentication
 *
 * @returns {Promise<void>} A promise that resolves when the user is successfully authenticated.
 *
 * @example
 * // Example usage:
 * await testAuthentication();
 */
export const testAuthentication =
  async (): Promise<void | SwaggerValidationError> => {
    try {
      const response: AxiosResponse<void> = await UserApi.authenticatedList();

      if (response.status === 200) {
        logger.info('User authenticated');
        return Promise.resolve();
      } else {
        return new SwaggerValidationError();
      }
    } catch (error) {
      return HandleSwaggerValidationError(error, {401: null});
    }
  };

/**
 * Function to get the details of a user.
 *
 * @function getUserDetails
 *
 * @returns {Promise<UserGetSchema>} A promise that resolves with the user details.
 *
 * @example
 * // Example usage:
 * await getUserDetails();
 * // Returns the user details.
 */
export const getUserDetails = async (): Promise<
  UserGetSchema | SwaggerValidationError
> => {
  try {
    const response: AxiosResponse<UserGetSchema> = await UserApi.detailsList();

    if (response.status === 200) {
      return response.data;
    } else {
      return new SwaggerValidationError();
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {500: null});
  }
};
