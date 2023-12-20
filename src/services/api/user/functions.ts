import {AxiosResponse, AxiosError} from 'axios';
import api from '../apiService';
import {UserCreateSchema, UserGetSchema, LoginUserSchema} from './types';

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlaskLoginCookie} from '../../asyncStorage/types';

export const createUser = async (userData: UserCreateSchema): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.post(
      '/user/create',
      userData,
    );

    if (response.status === 204) {
      return Promise.resolve();
    } else {
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const errorMessage =
        (axiosError.response?.data as {message?: string})?.message ||
        'Unknown error occurred';

      switch (statusCode) {
        case 400:
          throw `User validation error: ${errorMessage}`;
        case 409:
          throw `User already exists: ${errorMessage}`;
        default:
          throw `Unexpected status code: ${statusCode}`;
      }
    } else {
      // Handle network or other errors.
      throw axiosError.message || 'Unknown error occurred';
    }
  }
};

export const loginUser = async (
  credentials: LoginUserSchema,
): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.post(
      '/user/login',
      credentials,
    );
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
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const errorMessage =
        (axiosError.response?.data as {message?: string})?.message ||
        'Unknown error occurred';

      // Handle specific response status codes.
      switch (statusCode) {
        case 401:
          throw `Login failed: ${errorMessage}`;
        default:
          throw `Unexpected status code: ${statusCode}`;
      }
    } else {
      // Handle network or other errors.
      throw axiosError.message || 'Unknown error occurred';
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.post('/user/logout');

    if (response.status === 204) {
      AsyncStorage.removeItem(FlaskLoginCookie);
      return Promise.resolve();
    } else {
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const errorMessage =
        (axiosError.response?.data as {message?: string})?.message ||
        'Unknown error occurred';

      switch (statusCode) {
        case 400:
          throw `Logout failed due to invalid credentials: ${errorMessage}`;
        default:
          throw `Unexpected status code: ${statusCode}`;
      }
    } else {
      // Handle network or other errors.
      throw axiosError.message || 'Unknown error occurred';
    }
  }
};

export const testAuthentication = async (): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.get('/user/authenticated');

    if (response.status === 200) {
      console.log('User authenticated');
      return Promise.resolve();
    } else {
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const errorMessage =
        (axiosError.response?.data as {message?: string})?.message ||
        'Unknown error occurred';

      switch (statusCode) {
        case 500:
          console.log('User not authenticated');
          throw `User not authenticated: ${errorMessage}`;
        default:
          throw `Unexpected status code: ${statusCode}`;
      }
    } else {
      // Handle network or other errors.
      throw axiosError.message || 'Unknown error occurred';
    }
  }
};

export const getUserDetails = async (): Promise<UserGetSchema> => {
  try {
    const response: AxiosResponse<UserGetSchema> = await api.get(
      '/user/details',
    );

    if (response.status === 200) {
      return response.data;
    } else {
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const statusCode = axiosError.response.status;
      const errorMessage =
        (axiosError.response?.data as {message?: string})?.message ||
        'Unknown error occurred';

      switch (statusCode) {
        case 500:
          throw `User not authenticated: ${errorMessage}`;
        default:
          throw `Unexpected status code: ${statusCode}`;
      }
    } else {
      // Handle network or other errors.
      throw axiosError.message || 'Unknown error occurred';
    }
  }
};
