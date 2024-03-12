// React Import
import React from 'react';
// Components
import {TextInput, StyleSheet} from 'react-native';
// Styling
import {darkThemeColors, lightThemeColors, bodyTextStyles} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the Number Input Component
 *
 * @interface NumberInputProps
 *
 * @param {boolean} allowFloat - Boolean to allow float values
 * @param {string} inputValue - The current value of the input
 * @param {React.Dispatch<React.SetStateAction<string>>} setInputValue - Function to set the input value
 * @param {object} style - Style object to be applied to the input (optional)
 */
interface NumberInputProps {
  allowFloat: boolean;
  inputValue: string;
  setInputValue: any;
  style?: object;
  maxVal?: number;
}

/**
 * Number Input Component
 *
 * @component NumberInput
 * @param {Object} props - Component Number Input Props
 * @returns {React.FC<NumberInputProps>} - React Component
 */
const NumberInput: React.FC<NumberInputProps> = ({
  allowFloat,
  inputValue,
  setInputValue,
  style,
  maxVal,
}: NumberInputProps): React.ReactElement<NumberInputProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const handleChange = (text: string) => {
    // Allow only numbers and, if allowFloat is true, a single dot for float values
    if (allowFloat) {
      text = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
      text = text.replace(/[^0-9]/g, '');
    }
    const num = parseFloat(text);
    if (maxVal && num > maxVal) {
      console;
    }
    setInputValue(text);
  };

  const handleFocus = () => {
    if (inputValue === '0' || inputValue === '0.00') {
      console.log('inputValue', inputValue);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() === '') {
      setInputValue(allowFloat ? '0.0' : '0');
    }
  };

  return (
    <TextInput
      value={inputValue}
      defaultValue={allowFloat ? '0.0' : '0'}
      style={[styles.textInput, {color: currentTheme.text}, style]}
      onChangeText={handleChange}
      keyboardType={allowFloat ? 'numeric' : 'number-pad'}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    ...bodyTextStyles.large,
    maxWidth: 100,
  },
});

export default NumberInput;
