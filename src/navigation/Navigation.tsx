import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import SettingsScreen from '../screens/Settings';

import BottomNavBar from '../components/navbar/BottomNavBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type AppNavigatorProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({navigation}) => {
  return (
    // eslint-disable-next-line react/no-unstable-nested-components
    <Tab.Navigator tabBar={() => <BottomNavBar navigation={navigation} />}>
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
        <Stack.Screen name="App" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
