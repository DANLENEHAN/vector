import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  fontSizes,
  fonts,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

type NumberInputProps = {
  allowFloat: boolean;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  style?: object;
};

const NumberInput: React.FC<NumberInputProps> = ({
  allowFloat,
  inputValue,
  setInputValue,
  style,
}) => {
  //const [inputValue, setInputValue] = useState(allowFloat ? '0.0' : '0');
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const handleChange = (text: string) => {
    let validatedText = text;

    // Allow only numbers and, if allowFloat is true, a single dot for float values
    if (allowFloat) {
      validatedText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
      validatedText = text.replace(/[^0-9]/g, '');
    }
    setInputValue(validatedText);
  };

  const handleFocus = () => {
    console.log('Removing 0');
    if (inputValue === '0' || inputValue === '0.0') {
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
      style={[style, styles.textInput, {color: currentTheme.text}]}
      onChangeText={handleChange}
      keyboardType={allowFloat ? 'numeric' : 'number-pad'}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: 120,
    textAlign: 'center',
    fontFamily: fonts.primary,
    fontSize: fontSizes.title,
    margin: 10,
  },
});

export default NumberInput;
