import {AxiosResponse, AxiosError} from 'axios';
import api from '../apiService';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginUser = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
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
