import React from 'react';
import {View} from 'react-native';
import ClickableTile from '../../../../src/components/buttons/ClickableTile';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../src/styles/Main';

export default {
  title: 'components/buttons/ClickableTile',
  component: ClickableTile,
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

const Template = (args: any) => <ClickableTile {...args} />;

export const Default = Template.bind({});
Default.args = {
  onPress: () => alert('Clicked!'),
  text: 'Click Me!',
  label: 'Weight',
  icon: 'weight-scale',
  backgroundColor: '#3498db',
};

export const WithLastTracked = Template.bind({});
WithLastTracked.args = {
  onPress: () => alert('Clicked!'),
  text: 'Click Me!',
  label: 'Weight',
  icon: 'weight-scale',
  backgroundColor: '#3498db',
  lastTracked: '12/12/2020',
};
