import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

// Screens
import LoginScreen from '../screens/Login';
import SettingsScreen from '../screens/settings/Settings';
import AccountSettings from '../screens/settings/AccountSettings';
import Splash from '../screens/Splash';
import Generic from '../screens/Generic';

// Components
import BottomNavBar from '../components/navbar/BottomNavBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomNavBar {...props} />}
      backBehavior="history">
      <Tab.Screen
        name="Home"
        component={Generic}
        initialParams={{name: 'Home'}}
      />
      <Tab.Screen
        name="Discover"
        component={Generic}
        initialParams={{name: 'Discover'}}
      />
      <Tab.Screen
        name="Track"
        component={Generic}
        initialParams={{name: 'Track'}}
      />
      <Tab.Screen
        name="Social"
        component={Generic}
        initialParams={{name: 'Social'}}
      />
      <Tab.Screen
        name="Progress"
        component={Generic}
        initialParams={{name: 'Progress'}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{tabBarButton: () => null}}
      />
    </Tab.Navigator>
  );
};

//Stack navigator for settigns screens
const SettingsStack = createNativeStackNavigator();

const SettingsNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <SettingsStack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{headerShown: false}}
      />
    </SettingsStack.Navigator>
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
