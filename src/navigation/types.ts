import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type SettingsParamList = {
  SettingsHome: undefined;
  AccountSettings: undefined;
  Preferences: undefined;
  Theme: undefined;
};

export type HomeParamList = {
  Home: undefined;
  Discover: undefined;
  Track: undefined;
  Social: undefined;
  Progress: undefined;
  Settings: NavigatorScreenParams<SettingsParamList>;
};

export type RootStackParamList = {
  Splash: undefined;
  App: NavigatorScreenParams<HomeParamList>;
  Login: undefined;
  // Tracking Screens
  MoodTracking: undefined;
  WeightTracking: undefined;
  WaterTracking: undefined;
  // Progress Screens
  MoodProgress: undefined;
  WeightProgress: undefined;
  WaterProgress: undefined;
};

export type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList & HomeParamList
>;
