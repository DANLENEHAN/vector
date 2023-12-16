import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserPreference} from '../services/asyncStorage/types';

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  systemTheme: 'light' | 'dark';
  setSystemTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // Getting the system's color scheme
  const initialColorScheme = Appearance.getColorScheme();

  // State to hold the current theme, defaulting to system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(
    initialColorScheme === 'dark' ? 'dark' : 'light',
  );

  // State to hold the user's preferred theme
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Effect to subscribe to changes in system's color scheme
  useEffect(() => {
    let userPreference: string | null = null;
    AsyncStorage.getItem(UserPreference).then(value => {
      userPreference = value;
    });
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      const systemColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
      setSystemTheme(systemColorScheme);
      if (!userPreference || userPreference === 'system') {
        setTheme(systemColorScheme);
      } else {
        setTheme(userPreference === 'dark' ? 'dark' : 'light');
      }
    });

    // Cleaning up the listener when the component unmounts
    return () => subscription.remove();
  }, [systemTheme]);

  // Function to set the theme and user's preferred theme
  const setThemeAndUserPreferredTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setSystemTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeAndUserPreferredTheme,
        systemTheme,
        setSystemTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
