// Navigation
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

export type NavBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export type BottomBarProps = {
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
};
