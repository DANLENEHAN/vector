// Functions
import React, {useEffect} from 'react';
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
// Components
import AuthNavigator from '@navigation/Navigation';
import {SystemProvider} from '@context/SystemContext';
// NetInfo
import NetInfo from '@react-native-community/netinfo';
import {apiBaseUrl} from '@services/api/ApiService';
// Types
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';

NetInfo.configure({
  reachabilityUrl: apiBaseUrl + '/health',
  reachabilityTest: async response => response.status === 200,
  // Wait if previous reachability check succeeded (60s)
  reachabilityLongTimeout: 60 * 1000,
  // Wait if previous reachability check failed (60s)
  reachabilityShortTimeout: 60 * 1000,
});

function App(): JSX.Element {
  useEffect(() => {
    // Component Mounts
    handleClientSessionEvent(ClientSessionEventType.AppOpen);
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

export default App;
