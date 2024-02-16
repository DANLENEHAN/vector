import React from 'react';
import {View, Text} from 'react-native';
import {Meta, Story} from '@storybook/react-native';
import BodyMap from '../../../../../src/components/visualisations/BodyMap/BodyMapComponent';

const MyComponent: React.FC = () => {
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
};

export default {
  title: 'BodyMap',
  component: BodyMap,
  decorators: [(Story: any) => <Story />],
} as Meta;

const Template: Story<any> = (args: any) => <BodyMap {...args} />;

export const Default = Template.bind({});
Default.args = {
  onPress: () => alert('Clicked!'),
  text: 'Click Me!',
};
