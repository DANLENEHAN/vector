import React from 'react';
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
};

const Template = (args: any) => (
  <PopupContainer PopupComponent={NotePopup} message="Add a note here..." />
);

export const Default = Template.bind({});
Default.args = {
  // Pass props here
};
