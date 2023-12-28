import {AxiosResponse} from 'axios';
import api from '../apiService';
import {UserCreateSchema, UserGetSchema} from '../swagger/data-contracts';
import {User} from '../swagger/User';

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlaskLoginCookie} from '../../asyncStorage/types';

// Functions
import {HandleSwaggerValidationError} from '../functions';

// Types
import {SwaggerValidationError, unknownErrorMessage} from '../types';

const UserApi = new User(api);

export const createUser = async (
  userData: UserCreateSchema,
): Promise<void | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<void> = await UserApi.createCreate(userData);

    if (response.status === 204) {
      return Promise.resolve();
    } else {
      return {message: unknownErrorMessage, data: {}} as SwaggerValidationError;
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {400: null, 409: null});
  }
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<void | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<void> = await UserApi.loginCreate(data);
    if (response.status === 204) {
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
      return Promise.resolve();
    } else {
      return {message: unknownErrorMessage, data: {}} as SwaggerValidationError;
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {400: null});
  }
};

export const logoutUser = async (): Promise<void | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<void> = await UserApi.logoutCreate();

    if (response.status === 204) {
      AsyncStorage.removeItem(FlaskLoginCookie);
      return Promise.resolve();
    } else {
      return {message: unknownErrorMessage, data: {}} as SwaggerValidationError;
    }
  } catch (error) {
    return HandleSwaggerValidationError(error, {400: null});
  }
};

export const testAuthentication =
  async (): Promise<void | SwaggerValidationError> => {
    try {
      const response: AxiosResponse<void> = await UserApi.authenticatedList();

      if (response.status === 200) {
        console.log('User authenticated');
        return Promise.resolve();
      } else {
        return {
          message: unknownErrorMessage,
          data: {},
        } as SwaggerValidationError;
      }
    } catch (error) {
      return HandleSwaggerValidationError(error, {500: null});
    }
  };

export const getUserDetails = async (): Promise<
  UserGetSchema | SwaggerValidationError
> => {
  try {
    const response: AxiosResponse<UserGetSchema> = await UserApi.detailsList();

    if (response.status === 200) {
      return response.data;
    } else {
      return {message: unknownErrorMessage, data: {}} as SwaggerValidationError;
    }
  } catch (error) {
    const validationError = HandleSwaggerValidationError(error, {500: null});
    throw Error(`Error: ${validationError.message}`);
  }
};
