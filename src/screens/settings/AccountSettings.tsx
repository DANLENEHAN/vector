import React from 'react';
import {View, StyleSheet} from 'react-native';
// Functions
import {logoutUser} from '../../services/api/user/functions';
// Components
import SettingsOption from '../../components/settings/SettingsOption';
import Header from '../../components/navbar/Header';
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
    <View style={styles.content}>
      <Header
        label="Account Settings"
        navigation={navigation}
        targetScreen="Settings"
      />
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
  profileSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    flex: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default AccountSettings;
