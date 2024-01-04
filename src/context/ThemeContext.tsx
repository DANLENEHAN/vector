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
import {UserThemePreference} from '../services/asyncStorage/types';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userPreferenceTheme: 'light' | 'dark' | 'system';
  setUserPreferenceTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType>(null!);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // useState will not reset the variables on re-render
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userPreferenceTheme, setUserPreferenceTheme] = useState<
    'light' | 'dark' | 'system'
  >('light');

  // Run once on mount
  useEffect(() => {
    // Set theme from cache if it exists otherwise use systems
    AsyncStorage.getItem(UserThemePreference).then(value => {
      if (value) {
        setUserPreferenceTheme(value as 'light' | 'dark' | 'system');
        if (value === 'system') {
          setTheme(Appearance.getColorScheme());
        } else {
          setTheme(value as 'light' | 'dark');
        }
      }
    });

    // Create system theme subscription
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
