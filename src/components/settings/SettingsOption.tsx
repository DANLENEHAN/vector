import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {fonts, fontSizes, lightTheme, darkTheme} from '../../theme';
import {useTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

type SettingsOptionProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

const SettingsOption: React.FC<SettingsOptionProps> = ({
  icon,
  label,
  onPress,
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
        <Icon name={icon} solid size={28} color={currentTheme.text} />
      </View>
      <View style={styles.labelHolder}>
        <Text
          style={[
            styles.labelText,
            {
              color: currentTheme.text,
              fontSize: fontSizes.medium,
              fontFamily: fonts.secondary,
            },
          ]}>
          {label}
        </Text>
      </View>
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
});

export default SettingsOption;
