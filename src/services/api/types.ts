export type StatusCodeToMessage = {
  /**
   * Object of Valid Status codes and messages
   * assoicated with them. Can be null to allow
   * use of api reponse message.
   */
  [statusCode: number]: string | null;
};

export type SwaggerValidationError = {
  data?: object;
  message: string;
};
