export interface ValidationRules {
  required?: boolean;
}

export interface TextValidationRules extends ValidationRules {
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
}
