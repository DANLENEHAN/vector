import BaseValidation from './BaseValidation';
import {TextValidationRules, TextValidationErrorMessages} from './Types';

/**
 * TextValidation class extends BaseValidation and provides additional text-specific validation rules.
 * It validates a given string value based on specified rules such as maximum length, minimum length, and pattern.
 */
export default class TextValidation extends BaseValidation {
  /** The text-specific validation rules for the field. */
  textRules: TextValidationRules;

  /** The name of the field being validated. */
  displayName: string;

  /**
   * Constructor for TextValidation class.
   *
   * @param displayName - The name of the field being validated.
   * @param textRules - Text-specific validation rules for the field.
   * @param errorMessages - Error messages for text-specific validation rules.
   */
  constructor(
    displayName: string,
    textRules: TextValidationRules,
    errorMessages?: TextValidationErrorMessages,
  ) {
    /**
     * Default error messages for text-specific rules, with placeholders for dynamic values.
     * These messages are used if custom error messages are not provided.
     */
    const defaultErrorMessages: TextValidationErrorMessages = {
      maxLength: `${displayName} exceeds maximum length of ${textRules.maxLength}`,
      minLength: `${displayName} must be at least ${textRules.minLength} characters long`,
      pattern: `${displayName} must match the pattern: ${textRules.pattern}`,
    };

    // Call the constructor of the base class (BaseValidation) with the provided rules and error messages.
    super(displayName, textRules, {...defaultErrorMessages, ...errorMessages});

    // Set the text-specific rules for this instance.
    this.textRules = textRules;

    // Set the displayName property.
    this.displayName = displayName;
  }

  /**
   * Validates the given string value based on the specified text-specific rules.
   *
   * @param value - The string value to be validated.
   * @returns True if validation passes, false otherwise.
   */
  validate(value: string): boolean {
    // Check the common validation rules using the base class method.
    if (!super.validate(value)) {
      return false;
    }

    // Check for maximum length rule violation.
    if (
      this.textRules.maxLength !== undefined &&
      value.length > this.textRules.maxLength
    ) {
      this.setError('maxLength', {maxLength: this.textRules.maxLength});
      return false;
    }

    // Check for minimum length rule violation.
    if (
      this.textRules.minLength !== undefined &&
      value.length < this.textRules.minLength
    ) {
      this.setError('minLength', {minLength: this.textRules.minLength});
      return false;
    }

    // Check for pattern rule violation.
    if (
      this.textRules.pattern !== undefined &&
      !this.textRules.pattern.test(value)
    ) {
      this.setError('pattern', {pattern: this.textRules.pattern});
      return false;
    }

    // Clear any existing errors if validation passes.
    this.clearError();
    return true;
  }
}
