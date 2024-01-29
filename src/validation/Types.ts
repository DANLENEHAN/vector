/**
 * Interface defining the base validation rules for a field.
 */
export interface BaseValidationRules {
  /** Specifies whether the field is required. */
  required?: boolean;
}

/**
 * Interface defining the base validation error messages for a field.
 * The keys represent the validation rule names, and the values are the corresponding error messages.
 */
export interface BaseValidationErrors {
  [key: string]: string | undefined;
  /** Error message for the 'required' rule. */
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
 * Interface defining the validation error messages for text fields.
 * Each property corresponds to a specific validation rule, and the values are the corresponding error messages.
 */
export interface TextValidationErrors {
  /** Error message for exceeding the maximum length specified in 'maxLength'. */
  maxLength?: string;
  /** Error message for not meeting the minimum required length specified in 'minLength'. */
  minLength?: string;
  /** Error message for not matching the specified regular expression pattern in 'pattern'. */
  pattern?: string;
}

/**
 * Type alias for keys used in login validation.
 * It restricts the allowed values to 'email' and 'password'.
 * Use this type to define and enforce the specific keys related to login validation.
 */
export type LoginValidationKey = 'email' | 'password';
