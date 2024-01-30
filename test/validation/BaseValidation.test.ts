import BaseValidation from '@validation/BaseValidation';

describe('BaseValidation', () => {
  it('should initialize with default values', () => {
    // Arrange
    // Act
    const baseValidation = new BaseValidation('fieldName');

    // Assert
    expect(baseValidation.displayName).toBe('fieldName');
    expect(baseValidation.rules).toEqual({required: true});
    expect(baseValidation.errorMessages).toEqual({
      required: 'fieldName is required',
    });
    expect(baseValidation.error).toBeNull();
  });

  it('should allow customization of rules and error messages', () => {
    // Arrange
    // Act
    const customErrorMessages = {
      required: 'Custom required message',
    };
    const baseValidation = new BaseValidation(
      'fieldName',
      {},
      customErrorMessages,
    );

    // Assert
    expect(baseValidation.rules).toEqual({required: true});
    expect(baseValidation.errorMessages).toEqual(customErrorMessages);
  });
});
