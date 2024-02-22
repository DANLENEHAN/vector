import React from 'react';
import MoodScreen from '../../../../src/screens/track/mood/Mood';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {mockStoryNavigation} from '../../constants';

export default {
  title: 'screens/track/Mood',
  component: MoodScreen,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = (args: any) => (
  <MoodScreen {...args} navigation={mockStoryNavigation} />
);

export const Default = Template.bind({});
Default.args = {
  // Pass props here
};
