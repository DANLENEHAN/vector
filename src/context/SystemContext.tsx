// React Import
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
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import {
  NetInfoState,
  NetInfoSubscription,
  addEventListener,
} from '@react-native-community/netinfo';
// Logger
import logger from '@utils/Logger';
// Functions
import {runDbMigrationProcess} from '@services/db/Functions';

/**
 * System Context
 * This context is used to store system wide variables
 * such as the theme, network status, etc.
 *
 * @interface SystemContextType
 *
 * @param {string} theme - The current theme of the app {light | dark}
 * @param {function} setTheme - Function to set the theme
 * @param {string} userPreferenceTheme - The user preference theme {light | dark | system}
 * @param {function} setUserPreferenceTheme - Function to set the user preference theme
 * @param {boolean} isConnected - Boolean to indicate if the device is connected to the internet
 * @param {boolean} systemVarsLoaded - Boolean to indicate if the system variables have been loaded
 */
interface SystemContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userPreferenceTheme: 'light' | 'dark' | 'system';
  setUserPreferenceTheme: (theme: 'light' | 'dark' | 'system') => void;
  isConnected: boolean;
  systemVarsLoaded: boolean;
  migrationsComplete: boolean;
}

const SystemContext = createContext<SystemContextType>(null!);
export const useSystem = () => useContext(SystemContext);

/**
 * System Provider
 * This provider is used to store system wide variables
 * such as the theme, network status, etc.
 *
 * @component SystemProvider
 * @example
 * <SystemProvider>
 *    <App />
 * </SystemProvider>
 *
 * @param {ReactNode} children - The children components to be wrapped by the provider
 * @returns {React.FC<{children: ReactNode}>} - React Component
 */
export const SystemProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // useState will not reset the variables on re-render
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userPreferenceTheme, setUserPreferenceTheme] = useState<
    'light' | 'dark' | 'system'
  >('light');
  const [isConnected, setIsConnected] = useState(false);
  const [systemVarsLoaded, setIsLoaded] = useState(false);
  const [migrationsComplete, setMigrationsComplete] = useState(false);

  // Run once on mount
  useEffect(() => {
    // Setup subscription to network status
    const networkSubscription: NetInfoSubscription = addEventListener(
      (state: NetInfoState) => {
        const connected =
          (state.isConnected && state.isInternetReachable) || false;
        setIsConnected(connected);
        const connectionStatusMessage = connected
          ? 'Connected'
          : 'Disconnected';
        logger.info('Network status changed: ' + connectionStatusMessage);
      },
    );

    // Set theme from cache if it exists otherwise use systems
    AsyncStorage.getItem(AsyncStorageKeys.UserThemePreference)
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

    runDbMigrationProcess().finally(() => {
      setMigrationsComplete(true);
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
      logger.info('Removing System subscriptions');
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
        migrationsComplete,
      }}>
      {children}
    </SystemContext.Provider>
  );
};
