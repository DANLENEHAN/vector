import {
  BaseValidationRules,
  BaseValidationErrorMessages,
} from '@validation/Types';

/**
 * Base class for field validation.
 * Provides common validation logic and error handling.
 */
export default class BaseValidation {
  /** The validation rules for the field. */
  protected rules: BaseValidationRules;

  /** The error messages corresponding to different validation rules. */
  protected errorMessages: BaseValidationErrorMessages;

  /** The current error message. Null if there is no error. */
  error: string | null = null;

  /** The name of the field being validated. */
  displayName: string;

  /**
   * Constructor for BaseValidation class.
   *
   * @param displayName - The name of the field being validated.
   * @param rules - Validation rules for the field.
   * @param errorMessages - Error messages for validation rules.
   */
  constructor(
    displayName: string,
    rules?: BaseValidationRules,
    errorMessages?: BaseValidationErrorMessages,
  ) {
    /**
     * Default rules include 'required' as true,
     * allowing for easy customization while ensuring a default behavior.
     */
    this.rules = {required: true, ...(rules || {})};

    // Set the displayName property.
    this.displayName = displayName;

    /**
     * Default error message for the 'required' rule is set to 'Value is required',
     * allowing for easy customization while ensuring a default behavior.
     */
    this.errorMessages = errorMessages || {
      required: `${this.displayName} is required`,
    };
  }

  /**
   * Validates the given value based on the specified rules.
   *
   * @param value - The value to be validated.
   * @returns True if validation passes, false otherwise.
   */
  validate(value: any): boolean {
    if (this.rules.required && (value === null || value === undefined)) {
      // If 'required' rule is not satisfied, set the corresponding error.
      this.setError('required');
      return false;
    }

    return true;
  }

  /**
   * Sets the error message based on the specified key and values.
   *
   * @param key - The key corresponding to the validation rule.
   * @param values - Additional values to replace placeholders in the error message.
   */
  setError(
    key: keyof BaseValidationErrorMessages,
    values?: Record<string, any>,
  ): void {
    const errorMessage = this.getErrorMessage(key, values);
    this.error = errorMessage;
  }

  /**
   * Clears the current error message.
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Retrieves the error message for the specified key, replacing placeholders with values if provided.
   *
   * @param key - The key corresponding to the validation rule.
   * @param values - Additional values to replace placeholders in the error message.
   * @returns The formatted error message or null if no message is found.
   */
  getErrorMessage(
    key: keyof BaseValidationErrorMessages,
    values?: Record<string, any>,
  ): string | null {
    const errorMessage = this.errorMessages[key];
    return errorMessage && values
      ? errorMessage.replace(
          /\${(\w+)}/,
          (_, match) => `${values[match as keyof BaseValidationErrorMessages]}`,
        )
      : errorMessage || null;
  }
}
