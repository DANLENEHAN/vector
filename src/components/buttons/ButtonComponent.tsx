// React Imports
import React from 'react';
// Components
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
// Styling
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
interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  text: string;
  style?: object;
}

/**
 * Button Component
 *
 * @component ButtonComponent
 * @example
 * <ButtonComponent
 *     onPress={() => logger.info('Button Pressed')}
 *     disabled={false}
 *     text={'Button Text'}
 *     style={{backgroundColor: 'red'}}
 * />
 *
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
