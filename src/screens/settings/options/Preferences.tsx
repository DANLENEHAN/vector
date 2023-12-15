import React from 'react';
// Components
import SettingsPage from '../../../components/settings/SettingsPage';
// Types
import {ScreenProps} from '../../types';
// Theme
import {lightThemeColors, darkThemeColors} from '../../../styles/main';
import {useTheme} from '../../../context/ThemeContext';

const AccountSettings: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? lightThemeColors : darkThemeColors;

  return (
    <SettingsPage
      navigation={navigation}
      settingsHeaderConfig={{
        navHeaderConfig: {
          label: 'Preferences',
          includeBackButton: true,
        },
      }}
      settingOptionsConfig={[
        {
          icon: 'circle-half-stroke',
          onPress: () => {},
          label: 'App Appearance',
          logo_circle_color: currentTheme.primary,
          caret: true,
        },
      ]}
    />
  );
};

export default AccountSettings;
