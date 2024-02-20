import React from 'react';
import {View} from 'react-native';
import {Meta, Story} from '@storybook/react-native';

import {layoutStyles} from '../../../../../src/styles/Main';
import BodyMap from '../../../../../src/components/visualisations/BodyMap/BodyMap';

export default {
  title: 'BodyMap',
  component: BodyMap,
  decorators: [
    (Story: any) => (
      <View style={{...layoutStyles.centerVertically}}>
        <Story />
      </View>
    ),
  ],
} as Meta;

const Template: Story<any> = (args: any) => <BodyMap {...args} />;

export const Default = Template.bind({});
