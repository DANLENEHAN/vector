// React imports
import React from 'react';

// Navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// Screens
import WellnessProgressScreen from '@/screens/progress/WellnessProgress';
import WorkoutProgressScreen from '@/screens/progress/WorkoutProgress';
import NutritionProgressScreen from '@/screens/progress/NutritionProgress';

// Components
import TrackNavBar from '@/components/navbar/TrackNavBar';

// Navigation stacks
const ProgressTabStack = createMaterialTopTabNavigator();

// Navigation for the Progress page
const ProgressTabNavigator: React.FC = () => {
  return (
    <ProgressTabStack.Navigator tabBar={props => <TrackNavBar {...props} />}>
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
