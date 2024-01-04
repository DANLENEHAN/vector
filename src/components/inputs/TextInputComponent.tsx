import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Styling
import {
  paddings,
  margins,
  borderRadius,
  borderWidth,
  darkThemeColors,
  lightThemeColors,
  iconSizes,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: boolean;
  iconName: string;
}

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
    <View style={[styles.inputContainer, {borderColor: currentTheme.borders}]}>
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
      <Icon name={iconName} size={iconSizes.xLarge} color={currentTheme.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margins.large,
    borderWidth: borderWidth.xSmall,
    borderRadius: borderRadius.medium,
    padding: paddings.small,
  },
  input: {
    flex: 1,
    marginLeft: margins.small,
  },
});

export default TextInputComponent;
