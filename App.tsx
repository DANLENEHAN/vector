import React, {useEffect} from 'react';
import AuthNavigator from '@navigation/Navigation';
import {SystemProvider} from '@context/SystemContext';
import {getCurrentRevision, runMigrations} from '@services/db/functions';
// Logger
import logger from '@utils/logger';

function App(): JSX.Element {
  useEffect(() => {
    logger.info('Running Migrations?');
    getCurrentRevision(runMigrations);
  }, []);

  return (
    <SystemProvider>
      <AuthNavigator />
    </SystemProvider>
  );
}

export default App;
