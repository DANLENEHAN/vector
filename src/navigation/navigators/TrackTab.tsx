// React imports
import React from 'react';

// Navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// Screens
import Workout from '../../screens/track/Workout';
import Nutrition from '../../screens/track/NutritionTracking';
import WellnessTracking from '../../screens/track/WellnessTracking';

// Components
import TrackNavBar from '../../components/navbar/TrackNavBar';

// Navigation stacks
const TrackTabStack = createMaterialTopTabNavigator();

// Navigation for the Tracking page
const TrackTabNavigator: React.FC = () => {
  return (
    <TrackTabStack.Navigator tabBar={props => <TrackNavBar {...props} />}>
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
