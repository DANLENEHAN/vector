// React Imports
import React from 'react';
// Components
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
// Styling
import {
  paddingSizes,
  borderRadius,
  marginSizes,
  darkThemeColors,
  lightThemeColors,
  buttonStyles,
  layoutStyles,
  ctaTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the Button Component
 *
 * @interface ButtonProps
 *
 * @param {() => void} onPress - Function to be called when the button is pressed
 * @param {boolean} disabled - Boolean to disable the button
 * @param {string} text - Text to be displayed on the button
 * @param {object} style - Style object to be applied to the button (optional)
 */
export interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  text: string;
  style?: object;
}

/**
 * Button Component
 *
 * @component ButtonComponent
 * @param {Object} props - Component Button Props
 * @returns {React.FC<ButtonProps>} - React Component
 */
const ButtonComponent: React.FC<ButtonProps> = ({
  onPress,
  disabled = false,
  text,
  style,
}: ButtonProps): React.ReactElement<ButtonProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const buttonBackgroundColor =
    style && 'backgroundColor' in style
      ? style.backgroundColor
      : currentTheme.button;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled
          ? {backgroundColor: currentTheme.disabledButton}
          : {backgroundColor: buttonBackgroundColor},
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
    ...layoutStyles.centerVertically,
    ...buttonStyles.small,
    padding: paddingSizes.small,
    borderRadius: borderRadius.medium,
    marginHorizontal: marginSizes.small,
  },
  buttonText: {
    ...ctaTextStyles.small,
  },
});

export default ButtonComponent;
