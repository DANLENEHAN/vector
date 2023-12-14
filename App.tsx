import React from 'react';
import AuthNavigator from './src/navigation/Navigation';
import {ThemeProvider} from './src/context/ThemeContext';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AuthNavigator />
    </ThemeProvider>
  );
}

export default App;
