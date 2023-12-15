import React from 'react';
// Components
import SettingsPage from '../../components/settings/SettingsPage';
// Types
import {ScreenProps} from '../types';

const SettingsScreen: React.FC<ScreenProps> = ({navigation}) => {
  return (
    <SettingsPage
      navigation={navigation}
      settingsHeaderConfig={{
        profileHeaderConfig: {
          name: 'Dan Lenehan',
          username: 'danLenehan97',
          profileImageUrl:
            'https://media.licdn.com/dms/image/C4D03AQF4P3hY2E3Hnw/profile-displayphoto-shrink_200_200/0/1567959504327?e=2147483647&v=beta&t=bCM3QPOhc-zfx_GYH4iQqsd9Rbuo-eE1EJhidbaEFFs',
        },
      }}
      settingOptionsConfig={[
        {
          icon: 'user',
          onPress: () => navigation.navigate('AccountSettings'),
          label: 'Account Settings',
          caret: true,
        },
        {
          icon: 'cog',
          onPress: () => navigation.navigate('Preferences'),
          label: 'Preferences',
          caret: true,
        },
        {
          icon: 'question',
          onPress: () => console.log('Pressed Support'),
          label: 'Support',
          caret: true,
        },
      ]}
    />
  );
};

export default SettingsScreen;
