// React Import
import React from 'react';
// Functions
import {logoutUser} from '@services/api/blueprints/user/Api';
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
// Components
import SettingsOption from '@components/settings/SettingsOption';
import Header from '@components/navbar/Header';
import {View, StyleSheet} from 'react-native';
// Types
import {ScreenProps} from '@screens/Types';
import {SwaggerValidationError} from '@services/api/Types';
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';
// Theme
import {lightThemeColors, darkThemeColors} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Logger
import logger from '@utils/Logger';
// Styling
import {layoutStyles} from '@styles/Main';

/**
 * Account Settings Screen
 *
 * @component AccountSettings
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the account settings screen component
 */
const AccountSettings: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const handleLogout = async () => {
    const response = await logoutUser();
    if (response instanceof SwaggerValidationError) {
      logger.error(`Error: ${response.message}`);
    } else {
      // Also captured upon logging in if required
      await handleClientSessionEvent(ClientSessionEventType.Logout);
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
          onClick={navigation.goBack}
          includeBackArrow={true}
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

export default AccountSettings;
