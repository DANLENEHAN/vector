import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import BodyMeasurementTracking from '../../../src/screens/track//bodyMeasurement/BodyMeasurementTracking';

import {SystemProvider} from '../../../src/context/SystemContext';

export default {
  title: 'BodyMeasurementTracking',
  component: BodyMeasurementTracking,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
} as Meta;

const Template: Story<any> = (args: any) => (
  <BodyMeasurementTracking {...args} />
);

export const Default = Template.bind({});
