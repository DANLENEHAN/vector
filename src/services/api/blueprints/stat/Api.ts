import {AxiosResponse} from 'axios';
import api from '@services/api/ApiService';
// Functions
import {HandleSwaggerValidationError} from '@services/api/Functions';
// Components
import {Stat} from '@services/api/swagger/Stat';
// Types
import {StatCreateSchema} from '@services/api//swagger/data-contracts';
import {SwaggerValidationError} from '@services/api/Types';

const StatApi = new Stat(api);

/**
 * Retrieves a list of stats based on the provided query parameters.
 *
 * @param {any} statQuery - The query parameters for retrieving stats.
 * @returns {Promise<StatCreateSchema[]>} A promise that resolves with the retrieved stats.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 * @example
 * // Example usage:
 * const statQuery = { /* query parameters * / };
 * await getStats(statQuery);
 */
export const getStats = async (
  statQuery: any,
): Promise<StatCreateSchema[] | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<StatCreateSchema[]> = await StatApi.postStat(
      statQuery,
    );
    if (response.status === 201) {
      return response.data as StatCreateSchema[];
    } else {
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    // Exception handling for getStats
    return HandleSwaggerValidationError(error, {400: null});
  }
};
