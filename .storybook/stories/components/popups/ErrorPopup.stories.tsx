import React from 'react';
import NotePopup from '../../../../src/components/popups/NotePopup';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {PopupContainer} from '../../constants';

export default {
  title: 'components/popup/ErrorPopup',
  component: NotePopup,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = (args: any) => (
  <PopupContainer PopupComponent={NotePopup} message="Error Message" />
);

export const Default = Template.bind({});
Default.args = {
  // Pass props here
};
