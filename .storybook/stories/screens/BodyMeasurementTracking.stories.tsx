import React from 'react';
import BodyMeasurementTracking from '../../../src/screens/track/bodyMeasurement/BodyMeasurementTracking';
import {SystemProvider} from '../../../src/context/SystemContext';
import {mockStoryNavigation} from '../constants';

export default {
  title: 'screens/track/bodyMeasurement/BodyMeasurementTracking',
  component: BodyMeasurementTracking,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = (args: any) => (
  <BodyMeasurementTracking {...args} navigation={mockStoryNavigation} />
);

export const Default = Template.bind({});
