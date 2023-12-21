// React imports
import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

// Screens
import LoginScreen from '../screens/Login';
import Splash from '../screens/Splash';
import Generic from '../screens/Generic';
import MoodScreen from '../screens/track/Mood';

// Stack navigators
import SettingsStackNavigator from './navigators/SettingsStack';
import TrackTabNavigator from './navigators/TrackTab';
import ProgressTabNavigator from './navigators/ProgressTab';

// Components
import BottomNavBar from '../components/navbar/BottomNavBar';

// Navigation stacks
const AppStack = createNativeStackNavigator<RootStackParamList>();
const AppHomeTabStack = createBottomTabNavigator();

// Navigation for the Home page
const AppNavigator: React.FC = () => {
  return (
    <AppHomeTabStack.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomNavBar {...props} />}
      backBehavior="history">
      <AppHomeTabStack.Screen
        name="Home"
        component={Generic}
        initialParams={{name: 'Home'}}
      />

      <AppHomeTabStack.Screen
        name="Discover"
        component={Generic}
        initialParams={{name: 'Discover'}}
      />
      <AppHomeTabStack.Screen name="Track" component={TrackTabNavigator} />
      <AppHomeTabStack.Screen
        name="Social"
        component={Generic}
        initialParams={{name: 'Social'}}
      />
      <AppHomeTabStack.Screen
        name="Progress"
        component={ProgressTabNavigator}
      />
      <AppHomeTabStack.Screen
        name="Settings"
        component={SettingsStackNavigator}
      />
    </AppHomeTabStack.Navigator>
  );
};

// Navigation for the entire app
const AuthNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="App"
          component={AppNavigator}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Mood"
          component={MoodScreen}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
