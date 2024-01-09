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
import {
  NetInfoState,
  NetInfoSubscription,
  addEventListener,
} from '@react-native-community/netinfo';

interface SystemContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userPreferenceTheme: 'light' | 'dark' | 'system';
  setUserPreferenceTheme: (theme: 'light' | 'dark' | 'system') => void;
  isConnected: boolean;
  systemVarsLoaded: boolean;
}

const SystemContext = createContext<SystemContextType>(null!);

export const useSystem = () => useContext(SystemContext);

export const SystemProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // useState will not reset the variables on re-render
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userPreferenceTheme, setUserPreferenceTheme] = useState<
    'light' | 'dark' | 'system'
  >('light');
  const [isConnected, setIsConnected] = useState(false);
  const [systemVarsLoaded, setIsLoaded] = useState(false); // Introduce loading state

  // Run once on mount
  useEffect(() => {
    // Setup subscription to network status
    const networkSubscription: NetInfoSubscription = addEventListener(
      (state: NetInfoState) => {
        setIsConnected(state.isConnected || false);
      },
    );

    // Set theme from cache if it exists otherwise use systems
    AsyncStorage.getItem(UserThemePreference)
      .then(value => {
        if (value) {
          setUserPreferenceTheme(value as 'light' | 'dark' | 'system');
          if (value === 'system') {
            setTheme(Appearance.getColorScheme() as 'light' | 'dark');
          } else {
            setTheme(value as 'light' | 'dark');
          }
        }
      })
      .finally(() => {
        setIsLoaded(true);
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
    return () => {
      console.log('Removing System subscriptions');
      subscription.remove();
      networkSubscription();
    };
  }, [userPreferenceTheme]);

  return (
    <SystemContext.Provider
      value={{
        theme,
        setTheme,
        userPreferenceTheme,
        setUserPreferenceTheme,
        isConnected,
        systemVarsLoaded,
      }}>
      {children}
    </SystemContext.Provider>
  );
};
