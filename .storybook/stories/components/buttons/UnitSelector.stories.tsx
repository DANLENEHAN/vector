import React, {useState} from 'react';
import {View} from 'react-native';
import UnitSelector from '../../../../src/components/buttons/UnitSelector';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../src/styles/Main';

export default {
  title: 'components/buttons/UnitSelector',
  component: UnitSelector,
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

const UnitSelectorContainer: React.FC<any> = (
  args: any,
): React.ReactElement => {
  const units = ['kg', 'lbs'];
  const [activeUnit, setActiveUnit] = useState('kg');

  return (
    <UnitSelector
      units={units}
      activeUnit={activeUnit}
      setActiveUnit={setActiveUnit}
      {...args}
    />
  );
};

const Template = (args: any) => <UnitSelectorContainer {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const CustomStyle = Template.bind({});
CustomStyle.args = {
  style: {height: 50, width: 150},
};
