// Navigation
import {ScreenNavigationProp} from '../../navigation/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';

export type NavBarProps = {
  navigation: ScreenNavigationProp;
};

export type BottomBarProps = {
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
  descriptors: BottomTabBarProps['descriptors'];
};

export type TopBarProps = {
  state: MaterialTopTabBarProps['state'];
  navigation: MaterialTopTabBarProps['navigation'];
  descriptors: MaterialTopTabBarProps['descriptors'];
};
