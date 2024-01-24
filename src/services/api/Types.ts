/**
 * Object of Valid Status codes and messages
 * assoicated with them. Can be null to allow
 * use of api reponse message.
 *
 * @interface StatusCodeToMessage
 *
 * @property {string} [statusCode]  The status code, key of the object.
 * @property {string} [message]  The message, value of the object.
 */
export interface StatusCodeToMessage {
  [statusCode: number]: string | null;
}

/**
 * Swagger Validation Error Object
 *
 * @description Object returned when request fails.
 *
 * @class SwaggerValidationError
 *
 * @property {string} [message]  The message of the error.
 * @property {object} [data]  The data object of the error.
 */
export class SwaggerValidationError {
  message: string;
  data: object;

  constructor(message?: string, data?: object) {
    this.message = message ?? unknownErrorMessage;
    this.data = data ?? {};
  }
}

export const unknownErrorMessage: string = 'Unknown error occurred';
