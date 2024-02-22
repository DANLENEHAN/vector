import React from 'react';
import MoodTagScreen from '../../../../src/screens/track/mood/MoodTag';
import {MoodValue} from '../../../../src/services/api/swagger/data-contracts';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {mockStoryNavigation} from '../../constants';

export default {
  title: 'screens/track/MoodTag',
  component: MoodTagScreen,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = (args: any) => (
  <MoodTagScreen
    {...args}
    route={{params: {mood: mockMood}}} // Pass mock mood data here
    navigation={mockStoryNavigation}
  />
);

export const Default = Template.bind({});
Default.args = {
  // Pass props here
};
const mockMood = {
  label: MoodValue.Amazing,
  icon: 'laugh',
  color: '#4EDC5E',
};
