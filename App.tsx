import React, {useEffect} from 'react';
import AuthNavigator from './src/navigation/Navigation';
import {SystemProvider} from './src/context/SystemContext';
import {getCurrentRevision, runMigrations} from './src/services/db/functions';

function App(): JSX.Element {
  useEffect(() => {
    console.log('Running Migrations?');
    getCurrentRevision(runMigrations);
  }, []);

  return (
    <SystemProvider>
      <AuthNavigator />
    </SystemProvider>
  );
}

export default App;
