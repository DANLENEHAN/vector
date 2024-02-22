import React from 'react';
import {View} from 'react-native';
import Note, {NoteProps} from '../../../../src/components/inputs/Note';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../src/styles/Main';

export default {
  title: 'components/inputs/Note',
  component: Note,
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

const Template = (args: any) => (
  <View
    style={{
      width: '90%',
      height: '90%',
      ...layoutStyles.centerVertically,
    }}>
    <Note {...args} />
  </View>
);

export const Default = Template.bind({});
Default.args = {};

export const WithHeader = Template.bind({});
WithHeader.args = {
  showTitle: true,
};

export const ShortLength = Template.bind({});
ShortLength.args = {
  notePlaceholder: '10CharMax',
  maxNoteLength: 10,
};

export const existingNote = Template.bind({});
existingNote.args = {
  existingNote: 'This is a note\n   \u2022 With a bullet point',
};
