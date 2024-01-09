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
  buttonHeight,
  buttonWidth,
} from '../../styles/main';
import {useSystem} from '../../context/SystemContext';

interface ButtonProps {
  onPress: () => void;
  disabled: boolean;
  text: string;
  style?: object;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  text,
  style,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled
          ? {backgroundColor: currentTheme.disabledButton}
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
    padding: paddings.small,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: margins.small,
    minWidth: buttonWidth,
    minHeight: buttonHeight,
  },
  buttonText: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.bold,
  },
});

export default ButtonComponent;
