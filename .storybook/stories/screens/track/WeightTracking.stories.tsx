import React from 'react';
import WeightTrackingScreen from '../../../../src/screens/track/WeightTracking';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {mockStoryNavigation} from '../../constants';

export default {
  title: 'screens/track/WeightTracking',
  component: WeightTrackingScreen,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = (args: any) => (
  <WeightTrackingScreen {...args} navigation={mockStoryNavigation} />
);

export const Default = Template.bind({});
Default.args = {
  // Pass props here
};
