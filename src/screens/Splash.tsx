import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

//Layouts
import ScreenWrapper from '../components/layout/ScreenWrapper';

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlaskLoginCookie} from '../services/asyncStorage/types';
import {testAuthentication} from '../services/api/blueprints/user_api';

// Types
import {ScreenProps} from './types';

const Spalsh: React.FC<ScreenProps> = ({navigation}) => {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(FlaskLoginCookie);
      if (value !== null) {
        await testAuthentication();
        navigation.navigate('App', {screen: 'Home'});
      } else {
        console.log('Auth failed, login required, redirecting');
        navigation.navigate('Login');
      }
    } catch (e) {
      console.log(`Trouble reading key ${FlaskLoginCookie} deleting...`);
      AsyncStorage.removeItem(FlaskLoginCookie);
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    getData();
  });

  return (
    <ScreenWrapper>
      <View>
        <Text>Loading Sheiva</Text>
      </View>
    </ScreenWrapper>
  );
};

export default Spalsh;
