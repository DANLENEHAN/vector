import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Styling
import {
  paddings,
  margins,
  borderRadius,
  borderWidth,
  darkThemeColors,
  lightThemeColors,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

type TextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName: string;
};

const TextInputComponent: React.FC<TextInputProps> = ({
  placeholder,
  value,
  iconName,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = false,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[styles.inputContainer, {borderColor: currentTheme.inputBorder}]}>
      <TextInput
        style={[
          styles.input,
          {
            color: currentTheme.text,
          },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize === true ? 'sentences' : 'none'}
      />
      <Icon name={iconName} size={30} color={currentTheme.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margins.large,
    borderWidth: borderWidth.xsmall,
    borderRadius: borderRadius.medium,
    padding: paddings.small,
  },
  input: {
    flex: 1,
    marginLeft: margins.small,
  },
});

export default TextInputComponent;
