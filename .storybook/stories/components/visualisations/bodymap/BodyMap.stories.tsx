import React from 'react';
import {View} from 'react-native';

import {layoutStyles} from '../../../../../src/styles/Main';
import BodyMap from '../../../../../src/components/visualisations/BodyMap/BodyMap';

export default {
  title: 'components/visualisations/bodymap/BodyMap',
  component: BodyMap,
  decorators: [
    (Story: any) => (
      <View style={{...layoutStyles.centerVertically}}>
        <Story />
      </View>
    ),
  ],
};

const Template = (args: any) => <BodyMap {...args} />;

export const Default = Template.bind({});
Default.args = {
  onBodyPartSelect: (bodyPart: string) =>
    console.log(`Selected Bodypart ${bodyPart}`),
};
