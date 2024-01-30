/**
 * Interface defining the base validation rules for a field.
 */
export interface BaseValidationRules {
  /** Specifies whether the field is required. */
  required?: boolean;
}

/**
 * Interface defining error messages for base validation rules.
 * Each key represents a validation rule, and its value is the corresponding error message.
 * The 'required' key is used to provide an error message for the presence/absence rule.
 *
 */
export interface BaseValidationErrorMessages {
  [key: string]: string | undefined;
  required?: string;
}

/**
 * Interface extending the base validation rules for text fields.
 */
export interface TextValidationRules extends BaseValidationRules {
  /** Specifies the maximum allowed length for the text field. */
  maxLength?: number;
  /** Specifies the minimum required length for the text field. */
  minLength?: number;
  /** Specifies a regular expression pattern that the text field must match. */
  pattern?: RegExp;
}

/**
 * Interface defining error messages for text-specific validation rules.
 * Extends the BaseValidationErrorMessages interface and adds additional keys
 * for text-related validation rules such as 'maxLength', 'minLength', and 'pattern'.
 *
 * @extends BaseValidationErrorMessages
 *
 */
export interface TextValidationErrorMessages
  extends BaseValidationErrorMessages {
  maxLength?: string;
  minLength?: string;
  pattern?: string;
}

/**
 * Type alias for keys used in login validation.
 * It restricts the allowed values to 'email' and 'password'.
 * Use this type to define and enforce the specific keys related to login validation.
 */
export type LoginValidationKey = 'email' | 'password';
