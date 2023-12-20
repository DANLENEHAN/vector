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
import NutritionTracking from '../screens/track/NutritionTracking';
import WeightTracking from '../screens/track/WeightTracking';
import WellnessTracking from '../screens/track/WellnessTracking';
import MoodScreen from '../screens/track/Mood';

// Components
import BottomNavBar from '../components/navbar/BottomNavBar';
import TrackNavBar from '../components/navbar/TrackNavBar';

const AppStack = createNativeStackNavigator<RootStackParamList>();
const AppHomeTabStack = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const TrackTabStack = createMaterialTopTabNavigator();

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
        component={NutritionTracking}
        initialParams={{name: 'Nutrition'}}
      />
      <TrackTabStack.Screen
        name="WellnessTracking"
        component={WellnessTracking}
        options={{
          tabBarLabel: 'Wellness',
        }}
      />
    </TrackTabStack.Navigator>
  );
};

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
      <AppHomeTabStack.Screen
        name="Progress"
        component={Generic}
        initialParams={{name: 'Progress'}}
      />
      <AppHomeTabStack.Screen name="Settings" component={SettingsNavigator} />
    </AppHomeTabStack.Navigator>
  );
};

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

        <AppHomeTabStack.Screen
          name="Weight"
          component={WeightTracking}
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
