// React Native imports
import React from 'react';
// Components
import {View, StyleSheet} from 'react-native';
import SettingsOption from '@components/settings/SettingsOption';
import Header from '@components/navbar/Header';
// Types
import {ScreenProps} from '@screens/Types';
// Theme
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

/**
 * Preferences Screen
 *
 * @component Preferences
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the preferences screen component
 */
const Preferences: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <Header label="Preferences" onClick={navigation.goBack} />
      </View>
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
    ...layoutStyles.centerVertically,
  },
  headerSection: {
    flex: 2,
    ...layoutStyles.centerVertically,
  },
  settingsSection: {
    flex: 8,
    ...layoutStyles.flexStartVertical,
  },
});

export default Preferences;
