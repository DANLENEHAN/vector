import React from 'react';

// Components
import {View, StyleSheet} from 'react-native';
import SettingsOption from '../../../components/settings/SettingsOption';
import Header from '../../../components/navbar/Header';

// Types
import {ScreenProps} from '../../types';

// Theme
import {lightThemeColors, darkThemeColors} from '../../../styles/main';
import {useTheme} from '../../../context/ThemeContext';

const Preferences: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
      <Header
        label="Preferences"
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <View style={styles.settingsSection}>
        <SettingsOption
          icon={'circle-half-stroke'}
          onPress={() => navigation.navigate('Settings', {screen: 'Theme'})}
          label="Theme"
          logo_circle_color={currentTheme.primary}
          caret={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    flex: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Preferences;
