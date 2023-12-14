import React from 'react';
import {View, StyleSheet} from 'react-native';
// Components
import SettingsOption from '../../components/settings/SettingsOption';
// Types
import { ScreenProps } from '../types';

const AccountSettings: React.FC<ScreenProps> = ({navigation}) => {
  return (
      <View style={styles.content}>
        <View style={styles.settingsSection}>
          <SettingsOption
            icon="arrow-right-from-bracket"
            onPress={() => console.log('Pressed Account Settings')}
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
