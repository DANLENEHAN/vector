import {AxiosResponse, AxiosError} from 'axios';
import api from '../apiService';
import {StatSchema} from './types';
import {QuerySchema} from '../types';

export const createStat = async (statData: StatSchema): Promise<void> => {
  /**
   * Creates a new stat record using the provided data.
   *
   * @param {StatSchema} statData - The data for creating the stat.
   * @returns {Promise<void>} A promise that resolves when the stat is successfully created.
   * @throws {string} Throws an error with a message describing the issue if the operation fails.
   * @example
   * // Example usage:
   * const statData = { /* stat data object * / };
   * await createStat(statData);
   */
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
  /**
   * Deletes a stat record with the specified ID.
   *
   * @param {number} statId - The ID of the stat to be deleted.
   * @returns {Promise<void>} A promise that resolves when the stat is successfully deleted.
   * @throws {string} Throws an error with a message describing the issue if the operation fails.
   * @example
   * // Example usage:
   * const statId = 42;
   * await deleteStat(statId);
   */
  try {
    statId;
    // Implementation for deleteStat
  } catch (error) {
    // Exception handling for deleteStat
  }
};

export const getStats = async (statQuery: QuerySchema): Promise<void> => {
  /**
   * Retrieves a list of stats based on the provided query parameters.
   *
   * @param {QuerySchema} statQuery - The query parameters for retrieving stats.
   * @returns {Promise<void>} A promise that resolves with the retrieved stats.
   * @throws {string} Throws an error with a message describing the issue if the operation fails.
   * @example
   * // Example usage:
   * const statQuery = { /* query parameters * / };
   * await getStats(statQuery);
   */
  try {
    statQuery;
    // Implementation for getStats
  } catch (error) {
    // Exception handling for getStats
  }
};

export const getStat = async (statId: number): Promise<void> => {
  /**
   * Retrieves a specific stat record based on the provided ID.
   *
   * @param {number} statId - The ID of the stat to be retrieved.
   * @returns {Promise<void>} A promise that resolves with the retrieved stat.
   * @throws {string} Throws an error with a message describing the issue if the operation fails.
   * @example
   * // Example usage:
   * const statId = 42;
   * await getStat(statId);
   */
  try {
    statId;
    // Implementation for getStat
  } catch (error) {
    // Exception handling for getStat
  }
};

export const updateStat = async (statData: StatSchema): Promise<void> => {
  /**
   * Updates an existing stat record with the provided data.
   *
   * @param {StatSchema} statData - The data for updating the stat.
   * @returns {Promise<void>} A promise that resolves when the stat is successfully updated.
   * @throws {string} Throws an error with a message describing the issue if the operation fails.
   * @example
   * // Example usage:
   * const statData = { /* updated stat data object * / };
   * await updateStat(statData);
   */
  try {
    statData;
    // Implementation for updateStat
  } catch (error) {
    // Exception handling for updateStat
  }
};
