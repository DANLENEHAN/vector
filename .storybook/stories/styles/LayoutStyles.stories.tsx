import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import {View, Text, ScrollView, ColorValue} from 'react-native';
import {SystemProvider} from '../../../src/context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  layoutStyles,
  headingTextStyles,
  borderRadius,
} from '../../../src/styles/Main';
import {useSystem} from '../../../src/context/SystemContext';

export default {
  title: 'styles/Layouts',
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <View style={{flex: 1, ...layoutStyles.centerVertically}}>
          <Story />
        </View>
      </SystemProvider>
    ),
  ],
} as Meta;

interface LayoutDisplayProps {
  label: string;
  layoutStyle: object;
}
interface LayoutTileProps {
  color: ColorValue | undefined;
  borderColor: ColorValue | undefined;
}

const LayoutTile: React.FC<LayoutTileProps> = ({color, borderColor}) => {
  return (
    <View
      style={{
        height: 50,
        width: 50,
        backgroundColor: color,
        borderWidth: 1,
        borderBottomColor: borderColor,
        borderRadius: borderRadius.medium,
      }}></View>
  );
};

const LayoutDisplay: React.FC<LayoutDisplayProps> = ({label, layoutStyle}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={{margin: 20}}>
      <Text style={{color: currentTheme.text, ...headingTextStyles.xSmall}}>
        {label}
      </Text>
      <View
        style={{
          height: 200,
          width: 200,
          borderWidth: 1,
          backgroundColor: currentTheme.text,
          ...layoutStyle,
        }}>
        <LayoutTile color="green" borderColor={currentTheme.background} />
        <LayoutTile color="yellow" borderColor={currentTheme.background} />
        <LayoutTile color="red" borderColor={currentTheme.background} />
      </View>
    </View>
  );
};

const Template: Story<any> = () => (
  <ScrollView style={{flex: 1}}>
    {Object.entries(layoutStyles).map(([key, style]) => (
      <LayoutDisplay key={key} label={key} layoutStyle={style as object} />
    ))}
  </ScrollView>
);

export const Default = Template.bind({});
