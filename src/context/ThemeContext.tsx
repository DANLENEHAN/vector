import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {Appearance} from 'react-native';

// Services
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserPreference} from '../services/asyncStorage/types';

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userPreferenceTheme: 'light' | 'dark' | 'system';
  setUserPreferenceTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // Getting the system's color scheme
  const initialColorScheme = Appearance.getColorScheme();

  // State to hold the current theme
  const [theme, setTheme] = useState<'light' | 'dark'>(
    initialColorScheme === 'dark' ? 'dark' : 'light',
  );

  // State to hold the user's preferred theme
  const [userPreferenceTheme, setUserPreferenceTheme] = useState<
    'light' | 'dark' | 'system'
  >('light');

  AsyncStorage.getItem(UserPreference).then(value => {
    if (value) {
      setUserPreferenceTheme(value as 'light' | 'dark' | 'system');
      if (value !== 'system') {
        setTheme(value as 'light' | 'dark');
      }
    }
  });

  // Effect to subscribe to changes in system's color scheme
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      const systemColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
      if (!userPreferenceTheme || userPreferenceTheme === 'system') {
        setTheme(systemColorScheme);
      } else {
        setTheme(userPreferenceTheme === 'dark' ? 'dark' : 'light');
      }
    });

    // Cleaning up the listener when the component unmounts
    return () => subscription.remove();
  });

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setTheme,
        userPreferenceTheme,
        setUserPreferenceTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
