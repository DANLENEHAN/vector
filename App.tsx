import React, {useEffect} from 'react';
import AuthNavigator from './src/navigation/Navigation';
import {ThemeProvider} from './src/context/ThemeContext';
import {getCurrentRevision, runMigrations} from './src/services/db/Database';

function App(): JSX.Element {
  useEffect(() => {
    console.log('Running Migrations?');
    getCurrentRevision(runMigrations);
  });

  return (
    <ThemeProvider>
      <AuthNavigator />
    </ThemeProvider>
  );
}

export default App;
