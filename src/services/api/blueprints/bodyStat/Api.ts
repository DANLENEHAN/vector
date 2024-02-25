import {AxiosResponse} from 'axios';
import {BodyStatApi} from '@services/api/ApiService';
// Functions
import {HandleSwaggerValidationError} from '@services/api/Functions';
// Components
// Types
import {BodyStatCreateSchema} from '@services/api/swagger/data-contracts';
import {SwaggerValidationError} from '@services/api/Types';

/**
 * Retrieves a list of stats based on the provided query parameters.
 *
 * @param {any} statQuery - The query parameters for retrieving stats.
 * @returns {Promise<BodyStatCreateSchema[]>} A promise that resolves with the retrieved stats.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const getStats = async (
  statQuery: any,
): Promise<BodyStatCreateSchema[] | SwaggerValidationError> => {
  try {
    const response: AxiosResponse<BodyStatCreateSchema[]> =
      await BodyStatApi.postBodyStat(statQuery);
    if (response.status === 201) {
      return response.data as BodyStatCreateSchema[];
    } else {
      // Handle unexpected response status codes.
      throw `Unexpected status code: ${response.status}`;
    }
  } catch (error) {
    // Exception handling for getStats
    return HandleSwaggerValidationError(error, {400: null});
  }
};
