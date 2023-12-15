import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome6';

// Theme
import {fonts, fontSizes, lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';

type SettingsOptionProps = {
  icon: string;
  label: string;
  onPress: () => void;
  fontColor?: string;
};

const SettingsOption: React.FC<SettingsOptionProps> = ({
  icon,
  label,
  onPress,
  fontColor,
}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      style={[
        styles.settingsOption,
        {backgroundColor: currentTheme.background},
      ]}
      onPress={onPress}>
      <View style={styles.logoHolder}>
        <Icon
          name={icon}
          solid
          size={28}
          color={fontColor ? fontColor : currentTheme.text}
        />
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
      <View style={styles.bottomBorder} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingsOption: {
    flexDirection: 'row',
    padding: 10,
  },
  logoHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelHolder: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  labelText: {},
  logoText: {},
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: '5%', // Align to start at 5% (90% width centered)
    right: '5%', // Align to end at 5%
    height: 1, // Thickness of the border
    backgroundColor: '#CCCCCC', // Border color, can be adjusted
  },
});

export default SettingsOption;
