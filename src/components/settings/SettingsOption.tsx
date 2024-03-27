// React Native Import
import React from 'react';
// Components
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  iconSizes,
  borderRadius,
  borderWidth,
  layoutStyles,
  bodyTextStyles,
  paddingSizes,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Interface for the SettingsOption Component
 *
 * @interface SettingsOptionProps
 *
 * @param {string} icon - The icon for the settings option
 * @param {string} label - The label for the settings option
 * @param {() => void} onPress - Function to be called when the settings option is pressed
 * @param {string} fontColor - The font color for the settings option (optional)
 * @param {boolean} caret - Boolean to determine if the settings option should have a caret (optional)
 * @param {string} logo_circle_color - The color for the logo circle (optional)
 */
interface SettingsOptionProps {
  icon: string;
  label: string;
  onPress: () => void;
  fontColor?: string;
  caret?: boolean;
  logo_circle_color?: string;
}

/**
 * Settings Option Component
 *
 * @component SettingsOption
 * @param {Object} props - Component SettingsOption Props
 * @returns {React.FC<SettingsOptionProps>} - React Component
 */
const SettingsOption: React.FC<SettingsOptionProps> = ({
  icon,
  label,
  onPress,
  fontColor,
  caret,
  logo_circle_color,
}: SettingsOptionProps): React.ReactElement<SettingsOptionProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <TouchableOpacity
      style={[
        styles.settingsOption,
        {borderColor: currentTheme.borders},
        {backgroundColor: currentTheme.background},
      ]}
      onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: logo_circle_color
              ? logo_circle_color
              : currentTheme.primary,
          },
        ]}>
        <Icon
          name={icon}
          solid
          size={iconSizes.medium}
          color={currentTheme.background}
        />
      </View>

      <Text style={[styles.labelHolder, {color: currentTheme.text}]}>
        {label}
      </Text>

      <View style={styles.iconContainer}>
        {caret && (
          <Icon
            name="caret-right"
            solid
            size={iconSizes.medium}
            color={fontColor ? fontColor : currentTheme.text}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingsOption: {
    ...layoutStyles.spaceBetweenHorizontal,
    borderBottomWidth: borderWidth.xSmall,
    padding: paddingSizes.small,
    width: '90%',
  },
  labelHolder: {
    ...bodyTextStyles.small,
    width: '75%',
  },
  iconContainer: {
    ...layoutStyles.centerHorizontally,
    borderRadius: borderRadius.small,
    width: iconSizes.xLarge,
    height: iconSizes.xLarge,
  },
});

export default SettingsOption;
