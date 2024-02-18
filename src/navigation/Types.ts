import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

/**
 * The params for the Settings Navigator.
 *
 * @type SettingsParamList
 *
 * @param {undefined} SettingsHome  The SettingsHome screen.
 * @param {undefined} AccountSettings  The AccountSettings screen.
 * @param {undefined} Preferences  The Preferences screen.
 * @param {undefined} Theme  The Theme screen.
 */
export type SettingsParamList = {
  SettingsHome: undefined;
  AccountSettings: undefined;
  Preferences: undefined;
  Theme: undefined;
};

/**
 * The params for the Home Navigator.
 *
 * @type HomeParamList
 *
 * @param {undefined} Home  The Home screen.
 * @param {undefined} Discover  The Discover screen.
 * @param {undefined} Track  The Track screen.
 * @param {undefined} Social  The Social screen.
 * @param {undefined} Progress  The Progress screen.
 * @param {NavigatorScreenParams<SettingsParamList>} Settings  The Settings screen.
 */
export type HomeParamList = {
  Home: undefined;
  Discover: undefined;
  Track: undefined;
  Social: undefined;
  Progress: undefined;
  Settings: NavigatorScreenParams<SettingsParamList>;
};

/**
 * The params for the Root Navigator.
 *
 * @type RootStackParamList
 *
 * @param {undefined} Splash  The Splash screen.
 * @param {NavigatorScreenParams<HomeParamList>} App  The App screen.
 * @param {undefined} Login  The Login screen.
 * @param {undefined} MoodTracking  The MoodTracking screen.
 * @param {undefined} WeightTracking  The WeightTracking screen.
 * @param {undefined} WaterTracking  The WaterTracking screen.
 * @param {undefined} MoodProgress  The MoodProgress screen.
 * @param {undefined} WeightProgress  The WeightProgress screen.
 * @param {undefined} WaterProgress  The WaterProgress screen.
 */
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
  BodyMeasurementTracking: undefined;
};

/**
 * The navigation prop for the Root Navigator.
 *
 * @type RootStackNavigationProp
 */
export type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList & HomeParamList
>;
