import {AxiosResponse, AxiosError} from 'axios';
import api from '../apiService';
import {StatSchema} from './types';
import {QuerySchema} from '../types';

export const createStat = async (statData: StatSchema): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await api.post(
      '/stat/create',
      statData,
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
          throw `Stat validation error: ${errorMessage}`;
        default:
          throw `Unexpected status code: ${statusCode}`;
      }
    } else {
      // Handle network or other errors.
      throw axiosError.message || 'Unknown error occurred';
    }
  }
};

export const deleteStat = async (statId: number): Promise<void> => {
  try {
    statId;
    // Implementation for deleteStat
  } catch (error) {
    // Exception handling for deleteStat
  }
};

export const getStats = async (statQuery: QuerySchema): Promise<void> => {
  try {
    statQuery;
    // Implementation for getStats
  } catch (error) {
    // Exception handling for getStats
  }
};

export const getStat = async (statId: number): Promise<void> => {
  try {
    statId;
    // Implementation for getStat
  } catch (error) {
    // Exception handling for getStat
  }
};

export const updateStat = async (statData: StatSchema): Promise<void> => {
  try {
    statData;
    // Implementation for updateStat
  } catch (error) {
    // Exception handling for updateStat
  }
};
