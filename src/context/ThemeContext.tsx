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
  userPreferenceTheme: 'light' | 'dark' | 'system';
  setUserPreferenceTheme: (theme: 'light' | 'dark' | 'system') => void;
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
  const [userPreferenceTheme, setUserPreferenceTheme] = useState<
    'light' | 'dark' | 'system'
  >('light');

  // Effect to subscribe to changes in system's color scheme
  useEffect(() => {
    AsyncStorage.getItem(UserPreference).then(value => {
      if (value) {
        setUserPreferenceTheme(value as 'light' | 'dark' | 'system');
      }
    });

    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      const systemColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
      setUserPreferenceTheme(systemColorScheme);
      if (!userPreferenceTheme || userPreferenceTheme === 'system') {
        setTheme(systemColorScheme);
      } else {
        setTheme(userPreferenceTheme === 'dark' ? 'dark' : 'light');
      }
    });

    // Cleaning up the listener when the component unmounts
    return () => subscription.remove();
  }, [userPreferenceTheme]);

  // Function to set the theme and user's preferred theme
  const setThemeAndUserPreferredTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setUserPreferenceTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeAndUserPreferredTheme,
        userPreferenceTheme,
        setUserPreferenceTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
