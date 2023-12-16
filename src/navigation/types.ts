import {NavigatorScreenParams} from '@react-navigation/native';

export type SettingsParamList = {
  SettingsHome: undefined;
  AccountSettings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  App: undefined;
  Home: undefined;
  Login: undefined;
  Settings: NavigatorScreenParams<SettingsParamList> | undefined;
};
