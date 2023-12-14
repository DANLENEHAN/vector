import React from 'react';
import {View, StyleSheet} from 'react-native';
// Functions
import {logoutUser} from '../../services/api/user/functions';
// Components
import SettingsOption from '../../components/settings/SettingsOption';
// Types
import {ScreenProps} from '../types';

const AccountSettings: React.FC<ScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.settingsSection}>
        <SettingsOption
          icon="arrow-right-from-bracket"
          onPress={() => handleLogout()}
          label="Logout"
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
