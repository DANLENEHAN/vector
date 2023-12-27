import React from 'react';
import {View, StyleSheet} from 'react-native';
// Functions
import {logoutUser} from '../../../services/api/blueprints/user_api';
// Components
import SettingsOption from '../../../components/settings/SettingsOption';
import Header from '../../../components/navbar/Header';
// Types
import {ScreenProps} from '../../types';
// Theme
import {lightThemeColors, darkThemeColors} from '../../../styles/main';
import {useTheme} from '../../../context/ThemeContext';

const AccountSettings: React.FC<ScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    const response = await logoutUser();
    if (response === undefined) {
      navigation.navigate('Login');
    } else {
      console.error(`Error: ${response.message}`);
    }
  };

  const {theme} = useTheme();
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
    //No background color
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
