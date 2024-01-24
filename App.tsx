// Functions
import React from 'react';

// Components
import AuthNavigator from '@navigation/Navigation';
import {SystemProvider} from '@context/SystemContext';

function App(): JSX.Element {
  return (
    <SystemProvider>
      <AuthNavigator />
    </SystemProvider>
  );
}

export default App;
