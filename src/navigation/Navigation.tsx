import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

// Screens
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import SettingsScreen from '../screens/settings/Settings';
import AccountSettings from '../screens/settings/AccountSettings';
import Splash from '../screens/Splash';

// Components
import BottomNavBar from '../components/navbar/BottomNavBar';
import HeaderBackButton from '../components/buttons/HeaderBackButton';

// Styling
import {useTheme} from '../context/ThemeContext';
import {
  lightThemeColors,
  darkThemeColors,
  fonts,
  fontWeights,
} from '../styles/main';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <Tab.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <BottomNavBar {...props} />}
      backBehavior="history">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={({navigation}) => ({
          // Access navigation prop correctly here
          headerShown: true,
          headerTitle: 'Account Settings',
          headerStyle: {
            backgroundColor: currentTheme.background,
          },
          headerTitleStyle: {
            fontWeight: fontWeights.bold,
            color: currentTheme.text,
            fontFamily: fonts.primary,
          },
          headerLeft: () => <HeaderBackButton navigation={navigation} />,
        })}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="App"
          component={AppNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
