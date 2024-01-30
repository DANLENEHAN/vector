import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TextInputComponent from '@components/inputs/TextInputComponent';
import TextValidation from '@validation/TextValidation';
import {LoginValidationSchema} from '@validation/Schemas';

jest.mock('@context/SystemContext', () => ({
  useSystem: jest.fn(() => ({theme: 'light'})),
}));

describe('TextInputComponent', () => {
  it('renders TextInputComponent correctly', () => {
    // Arrange
    const {getByPlaceholderText} = render(
      <TextInputComponent
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        iconName="lock"
        validation={
          new TextValidation('Password', LoginValidationSchema.password)
        }
      />,
    );
    // Act
    const input = getByPlaceholderText('Test Placeholder');
    // Assert
    expect(input).toBeTruthy();
  });

  it('handles text change and validation error correctly', () => {
    // Arrange
    const {getByPlaceholderText, getByTestId} = render(
      <TextInputComponent
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
        iconName="lock"
        validation={new TextValidation('Password', LoginValidationSchema.email)}
        enableErrors={true}
      />,
    );
    // Act
    const input = getByPlaceholderText('Test Placeholder');
    fireEvent.changeText(input, 'bogusEmail');
    const errorContainer = getByTestId('text-input-error');
    // Assert
    expect(errorContainer).toBeTruthy();
  });
});
