// React imports
import React from 'react';
// Navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// Screens
import Workout from '@screens/track/Workout';
import Nutrition from '@screens/track/NutritionTracking';
import WellnessTracking from '@screens/track/WellnessTracking';
// Components
import TopTabNavBar from '@components/navbar/TopTabNavBar';
// Types
import {TopBarProps} from '@components/navbar/types';

// Navigation stacks
const TrackTabStack = createMaterialTopTabNavigator();
//NavBar
const TrackTabBar = (props: TopBarProps) => <TopTabNavBar {...props} />;

/**
 * TrackTabNavigator Component
 *
 * @component TrackTabNavigator
 * @example
 * return (
 *   <TrackTabNavigator />
 * )
 *
 * @returns {React.FC} - React Component
 */
const TrackTabNavigator: React.FC = () => {
  return (
    <TrackTabStack.Navigator tabBar={TrackTabBar}>
      <TrackTabStack.Screen
        name="WorkoutTracking"
        component={Workout}
        initialParams={{name: 'Workout'}}
        options={{
          tabBarLabel: 'Workout',
        }}
      />
      <TrackTabStack.Screen
        name="NutritionTracking"
        component={Nutrition}
        initialParams={{name: 'Nutrition'}}
        options={{
          tabBarLabel: 'Nutrition',
        }}
      />
      <TrackTabStack.Screen
        name="WellnessTracking"
        component={WellnessTracking}
        options={{
          tabBarLabel: 'Wellness',
        }}
      />
    </TrackTabStack.Navigator>
  );
};

export default TrackTabNavigator;
