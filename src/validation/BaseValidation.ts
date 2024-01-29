import {ValidationRules} from './Types';

export default class BaseValidation {
  rules: ValidationRules;
  errorMessages: Record<string, string>;
  error: string | null = null; // New property to store the error

  constructor(rules?: ValidationRules, errorMessages?: Record<string, string>) {
    this.rules = {required: true, ...rules};
    this.errorMessages = errorMessages || {
      required: 'Value is required',
      // Add more default error messages as needed
    };
  }

  validate(value: any): boolean {
    if (this.rules.required && (value === null || value === undefined)) {
      this.setError('required');
      return false;
    }

    return true;
  }

  setError(key: string, values?: Record<string, any>): void {
    const errorMessage = this.getErrorMessage(key, values);
    this.error = errorMessage;
  }

  clearError(): void {
    this.error = null;
  }

  getErrorMessage(key: string, values?: Record<string, any>): string | null {
    const errorMessage = this.errorMessages[key];
    return errorMessage && values
      ? errorMessage.replace(/\${(\w+)}/, (_, match) => `${values[match]}`)
      : errorMessage || null;
  }
}
