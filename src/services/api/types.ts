export type StatusCodeToMessage = {
  /**
   * Object of Valid Status codes and messages
   * assoicated with them. Can be null to allow
   * use of api reponse message.
   */
  [statusCode: number]: string | null;
};

export class SwaggerValidationError {
  /**
   * Data object returned when request fails.
   */
  data?: object;
  message: string;

  constructor(message: string, data?: object) {
    this.message = message;
    this.data = data;
  }
}

export const unknownErrorMessage: string = 'Unknown error occurred';
