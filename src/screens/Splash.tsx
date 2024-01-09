import React, {useEffect, useCallback} from 'react';
import {View, Text} from 'react-native';

//Layouts
import ScreenWrapper from '../components/layout/ScreenWrapper';

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlaskLoginCookie} from '../services/asyncStorage/types';
import {testAuthentication} from '../services/api/blueprints/user/api';
import {useSystem} from '../context/SystemContext';

// Types
import {ScreenProps} from './types';

const Spalsh: React.FC<ScreenProps> = ({navigation}) => {
  const {isConnected, systemVarsLoaded} = useSystem();

  const getData = useCallback(async () => {
    const value = await AsyncStorage.getItem(FlaskLoginCookie);
    if (value === null) {
      console.log('Auth failed, login required, redirecting');
      navigation.navigate('Login');
    }

    // If the user has a session cookie and is connected we validate
    if (isConnected === true) {
      const response = await testAuthentication();
      if (response === undefined) {
        navigation.navigate('App', {screen: 'Home'});
      } else {
        console.log(
          `Trouble logging in with key ${FlaskLoginCookie} value ${value}. Deleting...`,
        );
        AsyncStorage.removeItem(FlaskLoginCookie);
        navigation.navigate('Login');
      }
    } else {
      // If user has cookie but isn't connected we allow them through
      navigation.navigate('Login');
    }
  }, [isConnected, navigation]);

  useEffect(() => {
    if (systemVarsLoaded) {
      getData();
    }
  }, [systemVarsLoaded, getData]);

  return (
    <ScreenWrapper>
      <View>
        <Text>Loading Sheiva</Text>
      </View>
    </ScreenWrapper>
  );
};

export default Spalsh;
