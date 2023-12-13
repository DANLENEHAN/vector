import React from 'react';
import Navigation from './src/navigation/Navigation';
import {ThemeProvider} from './src/context/ThemeContext';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}

export default App;
