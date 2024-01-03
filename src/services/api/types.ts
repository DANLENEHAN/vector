export type StatusCodeToMessage = {
  /**
   * Object of Valid Status codes and messages
   * assoicated with them. Can be null to allow
   * use of api reponse message.
   */
  [statusCode: number]: string | null;
};

export type SwaggerValidationError = {
  /**
   * Data object returned when request fails.
   */
  is_swagger_validation_error: boolean;
  data?: object;
  message: string;
};

export const unknownErrorMessage: string = 'Unknown error occurred';
