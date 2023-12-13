import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {Appearance} from 'react-native';

// Defining the shape of the context's value
type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

// Using the context in a custom hook for easy access
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // Getting the system's color scheme
  const colorScheme = Appearance.getColorScheme();
  // State to hold the current theme, defaulting to system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  // Effect to subscribe to changes in system's color scheme
  useEffect(() => {
    // Listening for changes in the system's theme
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    // Cleaning up the listener when the component unmounts
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
