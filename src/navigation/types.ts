import {NavigatorScreenParams} from '@react-navigation/native';

export type SettingsParamList = {
  SettingsHome: undefined;
  AccountSettings: undefined;
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
  AccountSettings: undefined;
  SettingsHome: undefined;
  Preferences: undefined;
  AppAppearance: undefined;
  Settings: NavigatorScreenParams<SettingsParamList> | undefined;
};
