// Navigation
import {ScreenNavigationProp} from '@navigation/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';

/**
 * The props for the NavBar component.
 * @interface NavBarProps
 *
 * @property {ScreenNavigationProp} navigation  The navigation object.
 */
export interface NavBarProps {
  navigation: ScreenNavigationProp;
}

/**
 * The props for the BottomBar component.
 * @interface BottomBarProps
 *
 * @property {BottomTabBarProps['state']} state  The state object.
 * @property {BottomTabBarProps['navigation']} navigation  The navigation object.
 * @property {BottomTabBarProps['descriptors']} descriptors  The descriptors object.
 */
export interface BottomBarProps {
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
  descriptors: BottomTabBarProps['descriptors'];
}

/**
 * The props for the TopBar component.
 * @interface TopBarProps
 *
 * @property {MaterialTopTabBarProps['state']} state  The state object.
 * @property {MaterialTopTabBarProps['navigation']} navigation  The navigation object.
 * @property {MaterialTopTabBarProps['descriptors']} descriptors  The descriptors object.
 */
export interface TopBarProps {
  state: MaterialTopTabBarProps['state'];
  navigation: MaterialTopTabBarProps['navigation'];
  descriptors: MaterialTopTabBarProps['descriptors'];
}
