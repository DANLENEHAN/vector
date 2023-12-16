import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {Appearance} from 'react-native';

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userPreferredTheme: 'light' | 'dark';
  setUserPreferredTheme: (theme: 'light' | 'dark') => void;
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
  const [userPreferredTheme, setUserPreferredTheme] = useState<
    'light' | 'dark'
  >(
    'light', // Set the default to 'light', you can change it based on your preference.
  );

  // Effect to subscribe to changes in system's color scheme
  useEffect(() => {
    // Listening for changes in the system's theme
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      // Only update the theme if the user hasn't selected a different theme
      if (!userPreferredTheme) {
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    // Cleaning up the listener when the component unmounts
    return () => subscription.remove();
  }, [userPreferredTheme]);

  // Function to set the theme and user's preferred theme
  const setThemeAndUserPreferredTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setUserPreferredTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeAndUserPreferredTheme,
        userPreferredTheme,
        setUserPreferredTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
