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

// Components
import BottomNavBar from '../components/navbar/BottomNavBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
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
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
