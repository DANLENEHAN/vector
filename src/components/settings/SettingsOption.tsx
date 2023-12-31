import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  fonts,
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  iconSizes,
  borderRadius,
  borderWidth,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

interface SettingsOptionProps {
  icon: string;
  label: string;
  onPress: () => void;
  fontColor?: string;
  caret?: boolean;
  logo_circle_color?: string;
}

const SettingsOption: React.FC<SettingsOptionProps> = ({
  icon,
  label,
  onPress,
  fontColor,
  caret,
  logo_circle_color,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <TouchableOpacity
      style={[
        styles.settingsOption,
        {backgroundColor: currentTheme.background},
      ]}
      onPress={onPress}>
      <View style={styles.logoHolder}>
        <View
          style={[
            styles.logoCircle,
            {
              backgroundColor: logo_circle_color
                ? logo_circle_color
                : currentTheme.primary,
            },
          ]}>
          <Icon
            name={icon}
            solid
            size={iconSizes.small}
            color={currentTheme.background}
          />
        </View>
      </View>
      <View style={styles.labelHolder}>
        <Text
          style={[
            styles.labelText,
            {
              color: fontColor ? fontColor : currentTheme.text,
              fontSize: fontSizes.medium,
              fontFamily: fonts.secondary,
            },
          ]}>
          {label}
        </Text>
      </View>

      <View style={styles.logoHolder}>
        {caret && (
          <Icon
            name="caret-right"
            solid
            size={iconSizes.medium}
            color={fontColor ? fontColor : currentTheme.text}
          />
        )}
      </View>

      <View
        style={[styles.bottomBorder, {backgroundColor: currentTheme.borders}]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingsOption: {
    flexDirection: 'row',
    padding: 10,
  },
  logoHolder: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelHolder: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  labelText: {},
  logoText: {},
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    right: '5%',
    height: borderWidth.xSmall,
  },
  logoCircle: {
    width: 25,
    height: 25,
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsOption;
