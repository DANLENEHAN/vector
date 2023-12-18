// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, HomeParamList} from '../../navigation/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

export type NavBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList & HomeParamList>;
};

export type BottomBarProps = {
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
};
