import React from 'react';
import {View, StyleSheet} from 'react-native';

// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
// Layouts
import BaseLayout from '../components/layout/BaseLayout';
// Components
import SettingsOption from '../components/settings/SettingsOption';
import ProfileHeader from '../components/settings/ProfileHeader';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  return (
    <BaseLayout navigation={navigation}>
      <View style={styles.content}>
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
            onPress={() => console.log('Pressed Account Settings')}
            label="Account Settings"
          />
          <SettingsOption
            icon="cog"
            onPress={() => console.log('Pressed Preferences')}
            label="Preferences"
          />
          <SettingsOption
            icon="question"
            onPress={() => console.log('Pressed Support')}
            label="Support"
          />
        </View>
      </View>
    </BaseLayout>
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
