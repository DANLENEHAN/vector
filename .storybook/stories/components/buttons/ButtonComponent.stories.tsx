import React from 'react';
import {View} from 'react-native';
import ButtonComponent from '../../../../src/components/buttons/ButtonComponent';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../src/styles/Main';

export default {
  title: 'components/buttons/ButtonComponent',
  component: ButtonComponent,
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

const Template = (args: any) => <ButtonComponent {...args} />;
const defaultStyle = {height: 50, width: 150};

export const Default = Template.bind({});
Default.args = {
  onPress: () => alert('Clicked!'),
  text: 'Click Me!',
  style: defaultStyle,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
  text: 'Disabled',
  style: defaultStyle,
};

export const CustomStyle = Template.bind({});
CustomStyle.args = {
  ...Default.args,
  text: 'Custom Style',
  style: {backgroundColor: 'blue', ...defaultStyle},
};
