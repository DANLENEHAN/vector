export interface StatusCodeToMessage {
  /**
   * Object of Valid Status codes and messages
   * assoicated with them. Can be null to allow
   * use of api reponse message.
   */
  [statusCode: number]: string | null;
}

export class SwaggerValidationError {
  /**
   * Data object returned when request fails.
   */
  message: string;
  data: object;

  constructor(message?: string, data?: object) {
    this.message = message ?? unknownErrorMessage;
    this.data = data ?? {};
  }
}

export const unknownErrorMessage: string = 'Unknown error occurred';
