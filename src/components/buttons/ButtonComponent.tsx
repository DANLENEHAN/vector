import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {
  fontSizes,
  fontWeights,
  paddings,
  borderRadius,
  margins,
  darkThemeColors,
  lightThemeColors,
  disabledButton,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

type ButtonProps = {
  onPress: () => void;
  disabled: boolean;
  text: string;
  style?: object;
};

const ButtonComponent: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  text,
  style,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled
          ? {backgroundColor: disabledButton}
          : {backgroundColor: currentTheme.button},
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.buttonText, {color: currentTheme.buttonText}]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: paddings.small,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: margins.small,
  },
  buttonText: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.bold,
  },
});

export default ButtonComponent;
