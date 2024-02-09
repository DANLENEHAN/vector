import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import ButtonComponent, {
  ButtonProps,
} from '../../src/components/buttons/ButtonComponent';
import {SystemProvider} from '../../src/context/SystemContext';

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
} as Meta;

const Template: Story<ButtonProps> = (args: any) => (
  <ButtonComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onPress: () => alert('Clicked!'),
  text: 'Click Me!',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
  text: 'Disabled',
};

export const CustomStyle = Template.bind({});
CustomStyle.args = {
  ...Default.args,
  text: 'Custom Style',
  style: {backgroundColor: 'blue', padding: 20},
};
