// Functions
import React, {useEffect} from 'react';
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
// Components
import AuthNavigator from '@navigation/Navigation';
import {SystemProvider} from '@context/SystemContext';
// Services
import NetInfo from '@react-native-community/netinfo';
import PushNotification from 'react-native-push-notification';
// Types
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';
import {apiBaseUrl} from '@services/api/ApiService';
// Constants
const config = require('./app.config.js');

NetInfo.configure({
  reachabilityUrl: apiBaseUrl + '/health',
  reachabilityTest: async response => response.status === 200,
  // Wait if previous reachability check succeeded (60s)
  reachabilityLongTimeout: 60 * 1000,
  // Wait if previous reachability check failed (60s)
  reachabilityShortTimeout: 60 * 1000,
  reachabilityShouldRun: () => true,
  useNativeReachability: false,
});

function App(): JSX.Element {
  useEffect(() => {
    // Clears notifcation badge count on app open
    PushNotification.setApplicationIconBadgeNumber(0);
    return () => {
      // Component Unmounts
      handleClientSessionEvent(ClientSessionEventType.AppClose);
    };
  }, []);

  return (
    <SystemProvider>
      <AuthNavigator />
    </SystemProvider>
  );
}
let AppEntryPoint = App;

if (config.extra.storybookEnabled === true) {
  AppEntryPoint = require('./.storybook').default;
}

export default AppEntryPoint;
