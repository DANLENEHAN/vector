import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import NotePopup from '../../../../src/components/popups/NotePopup';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {PopupContainer} from '../../constants';

export default {
  title: 'components/popup/NotePopup',
  component: NotePopup,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
} as Meta;

const Template: Story<any> = (args: any) => (
  <PopupContainer PopupComponent={NotePopup} message="Add a note here..." />
);

export const Default = Template.bind({});
Default.args = {
  // Pass props here
};
