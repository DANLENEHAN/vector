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

// Navigation for the Tracking page
const TrackTabNavigator: React.FC = () => {
  return (
    <TrackTabStack.Navigator tabBar={TrackTabBar}>
      <TrackTabStack.Screen
        name="Workout"
        component={Workout}
        initialParams={{name: 'Workout'}}
      />
      <TrackTabStack.Screen
        name="Nutrition"
        component={Nutrition}
        initialParams={{name: 'Nutrition'}}
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
