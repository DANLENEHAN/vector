// Types
import {AxiosError} from 'axios';
import {
  StatusCodeToMessage,
  SwaggerValidationError,
  unknownErrorMessage,
} from '@services/api/types';

/**
 * A function for handling Grau's Error responses. All response codes and
 * bodies are defined in 'src/services/api/swagger'.
 * @param {Object} props - The props object.
 * @returns {SwaggerValidationError} - Swagger Validation Object containing a message and maybe data.
 *
 * @throws {Error} - Error thrown if the status code received is not one of the expected ones.
 * @throws {Error} - Error thrown if the Requests suffers from a Network specific error.
 *
 * @example
 * const validationError: SwaggerValidationError = HandleSwaggerValidationError(error, {400: 'Bad Request'});
 */
export const HandleSwaggerValidationError = (
  error: unknown,
  statusCodeToMessage: StatusCodeToMessage,
  defaultErrorMessage: string = unknownErrorMessage,
): SwaggerValidationError => {
  const axiosError = error as AxiosError;
  if (axiosError.response) {
    const statusCode = axiosError.response.status;
    const errorMessage =
      (axiosError.response?.data as SwaggerValidationError)?.message ??
      defaultErrorMessage;
    const data =
      (axiosError.response?.data as SwaggerValidationError)?.data ?? {};

    for (const [key, val] of Object.entries(statusCodeToMessage)) {
      if (Number(key) === statusCode) {
        return new SwaggerValidationError(val ?? errorMessage, data);
      }
    }
    throw new Error(
      `Invalid status code received: ${statusCode}. Original message: ${errorMessage}`,
    );
  } else {
    throw new Error(
      `Network error: ${axiosError.message ?? defaultErrorMessage}`,
    );
  }
};
