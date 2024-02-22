// Functions
import * as sharedFunctions from '@shared/Functions';

// Test Objects
import {MockAlembicRevisionObject} from '../services/db/sync/Objects';

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getValuesAfterSpecifiedKey null key provided', () => {
    // Arrange
    // Act
    const response = sharedFunctions.getValuesAfterSpecifiedKey(
      MockAlembicRevisionObject,
      null,
    );
    /// Assert
    expect(response).toEqual(MockAlembicRevisionObject);
  });

  test('getValuesAfterSpecifiedKey first key provided', () => {
    // Arrange
    const {revisionIdOne, ...rest} = MockAlembicRevisionObject;
    revisionIdOne;
    // Act
    const response = sharedFunctions.getValuesAfterSpecifiedKey(
      MockAlembicRevisionObject,
      'revisionIdOne',
    );
    /// Assert
    expect(response).toEqual(rest);
  });

  test('getValuesAfterSpecifiedKey no revisions to process', () => {
    // Arrange
    // Act
    const response = sharedFunctions.getValuesAfterSpecifiedKey(
      MockAlembicRevisionObject,
      'revisionIdThree',
    );
    /// Assert
    expect(response).toEqual({});
  });

  test('should capitalize the first letter of a lowercase string', () => {
    const input = 'hello';
    const output = sharedFunctions.capitalizeString(input);
    expect(output).toBe('Hello');
  });

  test('should not change the string if the first letter is already capitalized', () => {
    const input = 'World';
    const output = sharedFunctions.capitalizeString(input);
    expect(output).toBe('World');
  });

  test('should capitalize the first letter of a mixed case string', () => {
    const input = 'gOoDbye';
    const output = sharedFunctions.capitalizeString(input);
    expect(output).toBe('GOoDbye');
  });

  test('should return an empty string when passed an empty string', () => {
    const input = '';
    const output = sharedFunctions.capitalizeString(input);
    expect(output).toBe('');
  });

  test('should return the same string when passed a single-character string', () => {
    const input = 'x';
    const output = sharedFunctions.capitalizeString(input);
    expect(output).toBe('X');
  });

  describe('transformsInternalNameToDisplay', () => {
    test('transforms snake_case to capitalized words separated by spaces', () => {
      expect(
        sharedFunctions.transformsInternalNameToDisplay(
          'example_internal_name',
        ),
      ).toBe('Example Internal Name');
    });

    test('handles single word without underscores correctly', () => {
      expect(sharedFunctions.transformsInternalNameToDisplay('example')).toBe(
        'Example',
      );
    });

    test('handles empty string without throwing error', () => {
      expect(sharedFunctions.transformsInternalNameToDisplay('')).toBe('');
    });
  });
});
