import React from 'react';
// Functions
import {logoutUser} from '../../services/api/user/functions';
// Components
import SettingsPage from '../../components/settings/SettingsPage';
// Types
import {ScreenProps} from '../types';
// Theme
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

const AccountSettings: React.FC<ScreenProps> = ({navigation}) => {
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? lightThemeColors : darkThemeColors;

  return (
    <SettingsPage
      navigation={navigation}
      settingsHeaderConfig={{
        navHeaderConfig: {
          label: 'Account Settings',
          includeBackButton: true,
        },
      }}
      settingOptionsConfig={[
        {
          icon: 'arrow-right-from-bracket',
          onPress: () => handleLogout(),
          label: 'Logout',
          logo_circle_color: currentTheme.error,
          caret: false,
        },
      ]}
    />
  );
};

export default AccountSettings;
