import React from 'react';
import {View, StyleSheet} from 'react-native';
// Components
import SettingsOption from '../../components/settings/SettingsOption';
import ProfileHeader from '../../components/settings/ProfileHeader';
// Types
import {ScreenProps} from '../types';
// Theme
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {useSystem} from '../../context/SystemContext';

const SettingsScreen: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
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
          icon="cog"
          onPress={() =>
            navigation.navigate('Settings', {screen: 'Preferences'})
          }
          label="Preferences"
          caret={true}
        />
        <SettingsOption
          icon="question"
          onPress={() => console.log('Pressed Support')}
          label="Support"
          caret={true}
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

export default SettingsScreen;
