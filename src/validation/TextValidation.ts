import BaseValidation from './BaseValidation';
import {TextValidationRules} from './Types';

export default class TextValidation extends BaseValidation {
  textRules: TextValidationRules;

  constructor(textRules: TextValidationRules) {
    const errorMessages: Record<string, string> = {
      maxLength: 'Value exceeds maximum length of ${maxLength}',
      minLength: 'Value must be at least ${minLength} characters long',
      pattern: 'Value must match the pattern: ${pattern}',
    };

    super(textRules, errorMessages);
    this.textRules = textRules;
  }

  validate(value: string): boolean {
    if (!super.validate(value)) {
      return false;
    }

    if (
      this.textRules.maxLength !== undefined &&
      value.length > this.textRules.maxLength
    ) {
      this.setError('maxLength', {maxLength: this.textRules.maxLength});
      return false;
    }

    if (
      this.textRules.minLength !== undefined &&
      value.length < this.textRules.minLength
    ) {
      this.setError('minLength', {minLength: this.textRules.minLength});
      return false;
    }

    if (
      this.textRules.pattern !== undefined &&
      !this.textRules.pattern.test(value)
    ) {
      this.setError('pattern', {pattern: this.textRules.pattern});
      return false;
    }

    this.clearError();
    // Clearing error when validation passes
    return true;
  }
}
