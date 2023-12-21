import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RootStackParamList} from '../navigation/types';

// Screens
import LoginScreen from '../screens/Login';
import SettingsScreen from '../screens/settings/Settings';
import AccountSettings from '../screens/settings/options/AccountSettings';
import ThemeScreen from '../screens/settings/options/Theme';
import Preferences from '../screens/settings/options/Preferences';
import Splash from '../screens/Splash';
import Generic from '../screens/Generic';
import Workout from '../screens/track/Workout';
import Nutrition from '../screens/track/Nutrition';
import WelnessTracking from '../screens/track/WellnessTracking';
import MoodScreen from '../screens/track/Mood';
import WellnessProgressScreen from '../screens/progress/WellnessProgress';
import WorkoutProgressScreen from '../screens/progress/WorkoutProgress';
import NutritionProgressScreen from '../screens/progress/NutritionProgress';

// Components
import BottomNavBar from '../components/navbar/BottomNavBar';
import TrackNavBar from '../components/navbar/TrackNavBar';

const AppStack = createNativeStackNavigator<RootStackParamList>();
const AppHomeTabStack = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const TrackTabStack = createMaterialTopTabNavigator();
const ProgressTabStack = createMaterialTopTabNavigator();

// Navigation for the Tracking page
const TrackNavigator: React.FC = () => {
  return (
    <TrackTabStack.Navigator tabBar={props => <TrackNavBar {...props} />}>
      <TrackTabStack.Screen
        name="Workout"
        component={Workout}
        initialParams={{name: 'Workout'}}
      />
      <TrackTabStack.Screen
        name="Nutrition"
        component={Nutrition}
        initialParams={{name: 'Nutrition'}}
      />
      <TrackTabStack.Screen
        name="Wellness"
        component={WelnessTracking}
        initialParams={{name: 'Wellness'}}
      />
    </TrackTabStack.Navigator>
  );
};

// Navigation for the Tracking page
const ProgressNavigator: React.FC = () => {
  return (
    <ProgressTabStack.Navigator tabBar={props => <TrackNavBar {...props} />}>
      <ProgressTabStack.Screen
        name="WorkoutProgress"
        component={WorkoutProgressScreen}
        initialParams={{name: 'Workout'}}
        options={{
          tabBarLabel: 'Workout',
        }}
      />
      <ProgressTabStack.Screen
        name="NutritionProgress"
        component={NutritionProgressScreen}
        initialParams={{name: 'Nutrition'}}
        options={{
          tabBarLabel: 'Nutrition',
        }}
      />
      <ProgressTabStack.Screen
        name="WellnessProgress"
        component={WellnessProgressScreen}
        initialParams={{name: 'Wellness'}}
        options={{
          tabBarLabel: 'Wellness',
        }}
      />
    </ProgressTabStack.Navigator>
  );
};

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
      <AppHomeTabStack.Screen name="Track" component={TrackNavigator} />
      <AppHomeTabStack.Screen
        name="Social"
        component={Generic}
        initialParams={{name: 'Social'}}
      />
      <AppHomeTabStack.Screen name="Progress" component={ProgressNavigator} />
      <AppHomeTabStack.Screen name="Settings" component={SettingsNavigator} />
    </AppHomeTabStack.Navigator>
  );
};

// Navigation for the Settings page
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
      <SettingsStack.Screen
        name="Preferences"
        component={Preferences}
        options={{headerShown: false}}
      />
      <SettingsStack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{headerShown: false}}
      />
    </SettingsStack.Navigator>
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
        <AppHomeTabStack.Screen name="Settings" component={SettingsNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
