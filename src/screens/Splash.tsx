// React Import
import React, {useEffect, useCallback} from 'react';
// Components
import {View, Text, StyleSheet} from 'react-native';
//Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlaskLoginCookie} from '@services/asyncStorage/types';
import {testAuthentication} from '@services/api/blueprints/user/api';
import {useSystem} from '@context/SystemContext';
//Theme
import {
  lightThemeColors,
  darkThemeColors,
  fontSizes,
  fonts,
  fontWeights,
} from '@styles/main';
// Types
import {ScreenProps} from '@screens/types';
// Logger
import logger from '@utils/logger';

const Splash: React.FC<ScreenProps> = ({navigation}) => {
  const {isConnected, systemVarsLoaded, theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const getData = useCallback(async () => {
    const value = await AsyncStorage.getItem(FlaskLoginCookie);
    if (value === null) {
      logger.info('Auth failed, login required, redirecting');
      navigation.navigate('Login');
    } else {
      // If the user has a session cookie and is connected we validate
      if (isConnected === true) {
        const response = await testAuthentication();
        if (response === undefined) {
          navigation.navigate('App', {screen: 'Home'});
        } else {
          logger.info(
            `Trouble logging in with key ${FlaskLoginCookie} value ${value}. Deleting...`,
          );
          AsyncStorage.removeItem(FlaskLoginCookie);
          navigation.navigate('Login');
        }
      } else {
        // If user has cookie but isn't connected we allow them through
        navigation.navigate('App', {screen: 'Home'});
      }
    }
  }, [isConnected, navigation]);

  useEffect(() => {
    if (systemVarsLoaded) {
      getData();
    }
  }, [systemVarsLoaded, getData]);

  return (
    <ScreenWrapper>
      <View
        style={[styles.content, {backgroundColor: currentTheme.background}]}>
        <Text style={[styles.logoText, {color: currentTheme.text}]}>
          Sheiva
        </Text>
        <Text style={[styles.versionText, {color: currentTheme.lightText}]}>
          v0.0.1
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.ultraBold,
    fontFamily: fonts.primary,
  },
  versionText: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.semiBold,
    fontFamily: fonts.secondary,
  },
});

export default Splash;
