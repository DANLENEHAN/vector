// React imports
import React from 'react';
// Navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// Screens
import WellnessProgressScreen from '@screens/progress/WellnessProgress';
import WorkoutProgressScreen from '@screens/progress/WorkoutProgress';
import NutritionProgressScreen from '@screens/progress/NutritionProgress';
// Components
import TopTabNavBar from '@components/navbar/TopTabNavBar';
// Types
import {TopBarProps} from '@components/navbar/types';

// Navigation stacks
const ProgressTabStack = createMaterialTopTabNavigator();
// NavBar
const ProgressTabBar = (props: TopBarProps) => <TopTabNavBar {...props} />;

/**
 * ProgressTabNavigator Component
 *
 * @component ProgressTabNavigator
 * @example
 * <ProgressTabNavigator />
 *
 * @returns {React.FC} - React Component
 */
const ProgressTabNavigator: React.FC = () => {
  return (
    <ProgressTabStack.Navigator tabBar={ProgressTabBar}>
      <ProgressTabStack.Screen
        name="WorkoutProgress"
        component={WorkoutProgressScreen}
        initialParams={{name: 'Workout'}}
        options={{
          tabBarLabel: 'Workout',
        }}
      />
      <ProgressTabStack.Screen
        name="NutritionProgress"
        component={NutritionProgressScreen}
        initialParams={{name: 'Nutrition'}}
        options={{
          tabBarLabel: 'Nutrition',
        }}
      />
      <ProgressTabStack.Screen
        name="WellnessProgress"
        component={WellnessProgressScreen}
        initialParams={{name: 'Wellness'}}
        options={{
          tabBarLabel: 'Wellness',
        }}
      />
    </ProgressTabStack.Navigator>
  );
};

export default ProgressTabNavigator;
