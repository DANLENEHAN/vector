import React from 'react';
import {View, StyleSheet} from 'react-native';
// Components
import SettingsOption from '../../components/settings/SettingsOption';
import Header from '../../components/navbar/Header';
import ProfileHeader from '../../components/settings/ProfileHeader';
// Types
import {SettingsHeaderConfig, SettingOptionsConfig} from './types';
// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

export type SettingsPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  settingOptionsConfig: SettingOptionsConfig[];
  settingsHeaderConfig: SettingsHeaderConfig;
};

const SettingsPage: React.FC<SettingsPageProps> = ({
  navigation,
  settingOptionsConfig,
  settingsHeaderConfig,
}) => {
  console.log(settingsHeaderConfig);
  return (
    <View style={styles.content}>
      {settingsHeaderConfig.navHeaderConfig && (
        <Header
          label={settingsHeaderConfig.navHeaderConfig.label}
          navigation={navigation}
          includeBackButton={
            settingsHeaderConfig.navHeaderConfig.includeBackButton
          }
        />
      )}
      {settingsHeaderConfig.profileHeaderConfig && (
        <View style={styles.profileSection}>
          <ProfileHeader
            name={settingsHeaderConfig.profileHeaderConfig.name}
            username={settingsHeaderConfig.profileHeaderConfig.username}
            profileImageUrl={
              settingsHeaderConfig.profileHeaderConfig.profileImageUrl
            }
          />
        </View>
      )}

      <View style={styles.settingsSection}>
        {settingOptionsConfig.map((option, index) => (
          <SettingsOption
            key={index}
            icon={option.icon}
            onPress={option.onPress}
            label={option.label}
            logo_circle_color={option.logo_circle_color}
            caret={option.caret}
          />
        ))}
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

export default SettingsPage;
