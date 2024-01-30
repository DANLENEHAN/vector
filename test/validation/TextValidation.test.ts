import TextValidation from '@validation/TextValidation';

describe('TextValidation', () => {
  it('should initialize with default values', () => {
    // Arrange
    // Act
    const textValidation = new TextValidation('fieldName', {
      maxLength: 10,
      minLength: 2,
      pattern: /^[a-zA-Z]+$/,
    });

    // Assert
    expect(textValidation.displayName).toBe('fieldName');
    expect(textValidation.textRules).toEqual({
      maxLength: 10,
      minLength: 2,
      pattern: /^[a-zA-Z]+$/,
    });
    expect(textValidation.rules).toEqual({
      required: true,
      maxLength: 10,
      minLength: 2,
      pattern: /^[a-zA-Z]+$/,
    });
    expect(textValidation.errorMessages).toEqual({
      required: 'fieldName is required',
      maxLength: 'fieldName exceeds maximum length of 10',
      minLength: 'fieldName must be at least 2 characters long',
      pattern: 'fieldName must match the pattern: /^[a-zA-Z]+$/',
    });
    expect(textValidation.error).toBeNull();
  });

  it('should validate successfully when no rules are violated', () => {
    // Arrange
    const textValidation = new TextValidation('fieldName', {
      maxLength: 10,
      minLength: 2,
      pattern: /^[a-zA-Z]+$/,
    });

    // Act
    const isValid = textValidation.validate('validValue');

    // Assert
    expect(isValid).toBe(true);
    expect(textValidation.error).toBeNull();
  });

  it('should set error for maxLength rule violation', () => {
    // Arrange
    const textValidation = new TextValidation('fieldName', {
      maxLength: 5,
    });

    // Act
    const isValid = textValidation.validate('invalidValue');

    // Assert
    expect(isValid).toBe(false);
    expect(textValidation.error).toBe('fieldName exceeds maximum length of 5');
  });

  it('should set error for minLength rule violation', () => {
    // Arrange
    const textValidation = new TextValidation('fieldName', {
      minLength: 8,
    });

    // Act
    const isValid = textValidation.validate('short');

    // Assert
    expect(isValid).toBe(false);
    expect(textValidation.error).toBe(
      'fieldName must be at least 8 characters long',
    );
  });

  it('should set error for pattern rule violation', () => {
    // Arrange
    const textValidation = new TextValidation('fieldName', {
      pattern: /^[0-9]+$/,
    });

    // Act
    const isValid = textValidation.validate('abc123');

    // Assert
    expect(isValid).toBe(false);
    expect(textValidation.error).toBe(
      'fieldName must match the pattern: /^[0-9]+$/',
    );
  });

  it('should handle multiple rule violations and set the first encountered error', () => {
    // Arrange
    const textValidation = new TextValidation('fieldName', {
      maxLength: 5,
      minLength: 8,
      pattern: /^[0-9]+$/,
    });

    // Act
    const isValid = textValidation.validate('abc');

    // Arrange
    expect(isValid).toBe(false);
    expect(textValidation.error).toBe(
      'fieldName must be at least 8 characters long',
    );
  });
});
