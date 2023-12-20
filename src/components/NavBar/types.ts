// Navigation
import {ScreenNavigationProp} from '../../navigation/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

export type NavBarProps = {
  navigation: ScreenNavigationProp;
};

export type BottomBarProps = {
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
  descriptors: BottomTabBarProps['descriptors'];
};
