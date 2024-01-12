// React Import
import React from 'react';
// Functions
import {logoutUser} from '@services/api/blueprints/user/api';
// Components
import SettingsOption from '@components/settings/SettingsOption';
import Header from '@components/navbar/Header';
import {View, StyleSheet} from 'react-native';
// Types
import {ScreenProps} from '@screens/types';
import {SwaggerValidationError} from '@services/api/types';
// Theme
import {lightThemeColors, darkThemeColors} from '@styles/main';
import {useSystem} from '@context/SystemContext';
// Logger
import logger from '@utils/logger';

/**
 * Account Settings Screen
 *
 * @component AccountSettings
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the account settings screen component
 *
 * @example
 * <AccountSettings navigation={navigation}/>
 */
const AccountSettings: React.FC<ScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    const response = await logoutUser();
    if (response instanceof SwaggerValidationError) {
      logger.error(`Error: ${response.message}`);
    } else {
      navigation.navigate('Login');
    }
  };

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <Header
          label="Account Settings"
          navigation={navigation}
          includeBackArrow={true}
          includeTopMargin={true}
        />
      </View>
      <View style={styles.settingsSection}>
        <SettingsOption
          icon="arrow-right-from-bracket"
          onPress={() => handleLogout()}
          label="Logout"
          logo_circle_color={currentTheme.error}
          caret={false}
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
  headerSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    flex: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default AccountSettings;
