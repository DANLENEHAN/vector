// React Import
import React, {useEffect, useCallback} from 'react';
// Components
import {View, Text, StyleSheet} from 'react-native';
//Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import {testAuthentication} from '@services/api/blueprints/user/Api';
import {useSystem} from '@context/SystemContext';
//Theme
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  headingTextStyles,
  bodyTextStyles,
} from '@styles/Main';
// Types
import {ScreenProps} from '@screens/Types';
// Services
import NetInfo from '@react-native-community/netinfo';
import logger from '@utils/Logger';
// Functions
import {appEntryCallback} from '@services/system/SystemEvents';
import {AppEntryType} from '@services/system/Types';
import {
  getDeviceUserInfo,
  updateDeviceUserInfo,
} from '@services/asyncStorage/Functions';
import {DeviceUserData} from '@services/asyncStorage/Types';

/**
 * Splash screen that checks if the user is logged in or not
 *
 * If the user is logged in, it will redirect them to the home screen
 * If the user is not logged in, it will redirect them to the login screen
 *
 * @component Splash
 * @param {ScreenProps} props - navigation object to allow for redirection
 * @returns {React.FC<ScreenProps>} - React Component
 */
const Splash: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {systemVarsLoaded, theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const loginAndRedirectUser = useCallback(async () => {
    const activeUser = await AsyncStorage.getItem(AsyncStorageKeys.ActiveUser);
    let authToken: string | null = null;
    if (activeUser) {
      const deviceUserInfo: DeviceUserData | null = await getDeviceUserInfo();
      if (deviceUserInfo !== null) {
        authToken = deviceUserInfo[activeUser]?.token;
      }
    }
    if (activeUser === null || authToken === null) {
      logger.info('Auth failed, login required, redirecting');
      navigation.navigate('Login');
    } else {
      // If the user has a session cookie and is connected we validate
      const networkState = await NetInfo.fetch();
      if (
        networkState.isInternetReachable === true &&
        networkState.isConnected === true
      ) {
        const response = await testAuthentication();
        if (response === undefined) {
          navigation.navigate('App', {screen: 'Home'});
          appEntryCallback(AppEntryType.LoginAuthed, activeUser);
        } else {
          logger.info(
            "Trouble Authenticating with Active User's auth token. Token will be deleted.",
          );
          AsyncStorage.removeItem(AsyncStorageKeys.ActiveUser);
          updateDeviceUserInfo(activeUser, {token: null});
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('App', {screen: 'Home'});
        appEntryCallback(AppEntryType.LoginTokenOffline, activeUser);
      }
    }
  }, [navigation]);

  useEffect(() => {
    if (systemVarsLoaded) {
      loginAndRedirectUser();
    }
  }, [systemVarsLoaded, loginAndRedirectUser]);

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
    ...layoutStyles.centerVertically,
  },
  logoText: {
    ...headingTextStyles.large,
  },
  versionText: {
    ...bodyTextStyles.xSmall,
  },
});

export default Splash;
