import {AxiosResponse, AxiosError} from 'axios';
import api from '../apiService';
import {UserCreateSchema, LoginUserSchema} from './types';

export const createUser = async (userData: UserCreateSchema): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.post(
      '/user/create',
      userData,
    );

    // NOTE: API should return a 204 status code, but it returns 201 instead.
    if (response.status === 201) {
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

    // NOTE: API should return a 204 status code, but it returns 201 instead.
    if (response.status === 201) {
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
