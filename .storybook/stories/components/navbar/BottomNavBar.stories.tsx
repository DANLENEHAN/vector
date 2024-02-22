import React from 'react';
import BottomTabBar from '../../../../src/components/navbar/BottomNavBar';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SystemProvider} from '../../../../src/context/SystemContext';

// Mock components for each tab, you can replace these with real screens or simplified mocks
const HomeScreen = () => <View />;
const DiscoverScreen = () => <View />;
const TrackScreen = () => <View />;
const SocialScreen = () => <View />;
const ProgressScreen = () => <View />;
const SettingsScreen = () => <View />;

// Create a mock tab navigator using the real navigation library for accurate simulation
const MockTab = createBottomTabNavigator();

export default {
  title: 'components/navbar/BottomTabBar',
  component: BottomTabBar,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = args => (
  <NavigationContainer>
    <MockTab.Navigator {...args}>
      <MockTab.Screen name="Home" component={HomeScreen} />
      <MockTab.Screen name="Discover" component={DiscoverScreen} />
      <MockTab.Screen name="Track" component={TrackScreen} />
      <MockTab.Screen name="Social" component={SocialScreen} />
      <MockTab.Screen name="Progress" component={ProgressScreen} />
      <MockTab.Screen name="Settings" component={SettingsScreen} />
    </MockTab.Navigator>
  </NavigationContainer>
);

export const DefaultView = Template.bind({});

DefaultView.args = {
  tabBar: props => <BottomTabBar {...props} />,
  screenOptions: {headerShown: false},
  backBehavior: 'history',
};
