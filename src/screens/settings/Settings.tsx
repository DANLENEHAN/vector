// React imports
import React from 'react';
// Components
import {View, StyleSheet} from 'react-native';
import SettingsOption from '@components/settings/SettingsOption';
import ProfileHeader from '@components/settings/ProfileHeader';
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Types
import {ScreenProps} from '@screens/Types';
// Theme
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Logger
import logger from '@utils/Logger';

/**
 * Settings Screen
 *
 * @component SettingsScreen
 *
 * @param {ScreenProps} navigation - Stack Navigation
 *
 * @returns {React.FC} - Settings Screen Component
 */
const SettingsScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScreenWrapper>
      <View
        style={[styles.content, {backgroundColor: currentTheme.background}]}
        testID="settings-screen">
        <View style={styles.profileSection}>
          <ProfileHeader
            userName="Dan Lenehan"
            userUsername="danLenehan97"
            profileImageUrl="https://media.licdn.com/dms/image/C4D03AQF4P3hY2E3Hnw/profile-displayphoto-shrink_200_200/0/1567959504327?e=2147483647&v=beta&t=bCM3QPOhc-zfx_GYH4iQqsd9Rbuo-eE1EJhidbaEFFs"
          />
        </View>
        <View style={styles.settingsSection}>
          <SettingsOption
            icon="user"
            onPress={() =>
              navigation.navigate('Settings', {screen: 'AccountSettings'})
            }
            label="Account Settings"
            caret={true}
          />
          <SettingsOption
            icon="gear"
            onPress={() =>
              navigation.navigate('Settings', {screen: 'Preferences'})
            }
            label="Preferences"
            caret={true}
          />
          <SettingsOption
            icon="circle-info"
            onPress={() => logger.info('Pressed Support')}
            label="Support"
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
    ...layoutStyles.centerVertically,
  },
  profileSection: {
    flex: 3,
  },
  settingsSection: {
    flex: 7,
  },
});

export default SettingsScreen;
