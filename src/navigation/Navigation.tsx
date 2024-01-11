// React imports
import React from 'react';
// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
//// Screens
// Generic Screens
import LoginScreen from '../screens/Login';
import Splash from '../screens/Splash';
import Generic from '../screens/Generic';
// Track Screens
import WeightTracking from '../screens/track/WeightTracking';
import MoodScreen from '../screens/track/Mood';
import WaterScreen from '../screens/track/Water';
// Progress Screens
import WeightProgress from '../screens/progress/WeightProgress';
import MoodProgress from '../screens/progress/MoodProgress';
import WaterProgress from '../screens/progress/WaterProgress';
// Components
import BottomNavBar from '../components/navbar/BottomNavBar';
// Navigation stacks
import TrackTabNavigator from './navigators/TrackTab';
import ProgressTabNavigator from './navigators/ProgressTab';
import SettingsStackNavigator from './navigators/SettingsStack';
const AppStack = createNativeStackNavigator<RootStackParamList>();
const AppHomeTabStack = createBottomTabNavigator();

const BottomTabBar = props => <BottomNavBar {...props} />;

const AppNavigator: React.FC = () => {
  return (
    <AppHomeTabStack.Navigator
      screenOptions={{headerShown: false}}
      tabBar={BottomTabBar}
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
        {
          // Track Screens
        }
        <AppStack.Screen
          name="WeightTracking"
          component={WeightTracking}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="MoodTracking"
          component={MoodScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="WaterTracking"
          component={WaterScreen}
          options={{headerShown: false}}
        />
        {
          // Progress Screens
        }
        <AppStack.Screen
          name="WeightProgress"
          component={WeightProgress}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="MoodProgress"
          component={MoodProgress}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="WaterProgress"
          component={WaterProgress}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
