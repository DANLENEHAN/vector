import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import {View} from 'react-native';
import {
  TagSelector,
  TagSelectorProps,
} from '../../../../../src/components/inputs/TagSelector';
import {SystemProvider} from '../../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../../src/styles/Main';

export default {
  title: 'components/inputs/TagSelector/TagSelector',
  component: TagSelector,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <View style={{flex: 1, ...layoutStyles.centerVertically}}>
          <Story />
        </View>
      </SystemProvider>
    ),
  ],
} as Meta;

const Template: Story<TagSelectorProps> = (args: TagSelectorProps) => (
  <TagSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tagSelectorLabel: 'Tag Group',
  tags: [
    {
      label: 'Happy',
      icon: 'meh',
      color: 'yellow',
    },
    {
      label: 'Sad',
      icon: 'frown',
      color: 'yellow',
    },
    {
      label: 'Angry',
      icon: 'angry',
      color: 'red',
    },
    {
      label: 'Excited',
      icon: 'grin',
      color: 'green',
    },
  ],
};
