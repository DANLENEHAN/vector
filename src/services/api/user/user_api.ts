import {AxiosResponse, AxiosError} from 'axios';
import api from '../apiService';

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginRequest): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await api.post(
      '/user/login',
      credentials,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw (
      axiosError.response?.data ||
      axiosError.message ||
      'Unknown error occurred'
    );
  }
};
