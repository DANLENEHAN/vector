// Functions
import React from 'react';
// Components
import AuthNavigator from '@navigation/Navigation';
import {SystemProvider} from '@context/SystemContext';

// NetInfo
import NetInfo from '@react-native-community/netinfo';
import {apiBaseUrl} from '@services/api/ApiService';

NetInfo.configure({
  reachabilityUrl: apiBaseUrl + '/health',
  reachabilityTest: async response => response.status === 200,
  // Wait if previous reachability check succeeded (60s)
  reachabilityLongTimeout: 60 * 1000,
  // Wait if previous reachability check failed (60s)
  reachabilityShortTimeout: 60 * 1000,
});

function App(): JSX.Element {
  return (
    <SystemProvider>
      <AuthNavigator />
    </SystemProvider>
  );
}

export default App;
