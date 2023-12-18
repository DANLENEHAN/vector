// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from '../../navigation/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

export type NavBarProps = {
  navigation: NativeStackNavigationProp<HomeParamList>;
};

export type BottomBarProps = {
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
};
