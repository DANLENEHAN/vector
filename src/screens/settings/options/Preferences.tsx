// React Native imports
import React from 'react';
// Components
import {View, StyleSheet} from 'react-native';
import SettingsOption from '@components/settings/SettingsOption';
import Header from '@components/navbar/Header';
// Types
import {ScreenProps} from '@screens/Types';
// Theme
import {lightThemeColors, darkThemeColors, margins} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
import ScreenWrapper from '@components/layout/ScreenWrapper';

/**
 * Preferences Screen
 *
 * @component Preferences
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the preferences screen component
 *
 * @example
 * <Preferences navigation={navigation}/>
 */
const Preferences: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <ScreenWrapper>
      <View
        style={[styles.content, {backgroundColor: currentTheme.background}]}>
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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    marginTop: margins.xxLarge,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Preferences;
