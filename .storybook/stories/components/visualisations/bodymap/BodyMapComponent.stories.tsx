import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import BodyMap from '../../../../../src/components/visualisations/BodyMap/BodyMapComponent';

export default {
  title: 'BodyMap',
  component: BodyMap,
  decorators: [(Story: any) => <Story />],
} as Meta;

const Template: Story<any> = (args: any) => <BodyMap {...args} />;

export const Default = Template.bind({});
