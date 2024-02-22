import React from 'react';
import {View} from 'react-native';
import {Tag, TagProps} from '../../../../../src/components/inputs/TagSelector';
import {SystemProvider} from '../../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../../src/styles/Main';

export default {
  title: 'components/inputs/TagSelector/Tag',
  component: Tag,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <View style={{flex: 1, ...layoutStyles.centerVertically}}>
          <Story />
        </View>
      </SystemProvider>
    ),
  ],
};

const Template = (args: any) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Happy',
  icon: 'meh',
  color: 'yellow',
};

export const Long = Template.bind({});
Long.args = {
  label: 'Very long label',
  icon: 'meh',
  color: 'yellow',
};
