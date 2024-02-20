import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import {View, Text} from 'react-native';
import {SystemProvider} from '../../../src/context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  layoutStyles,
  headingTextStyles,
  bodyTextStyles,
  ctaTextStyles,
  borderRadius,
  marginSizes,
} from '../../../src/styles/Main';
import {useSystem} from '../../../src/context/SystemContext';

export default {
  title: 'styles/Text',
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

interface TextDisplayProps {
  label: string;
  textStyles: object;
  sampleText: string;
}

const sampleTexts = {
  heading: 'Sample Heading',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui. Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui.',
  cta: 'Join Now',
};

const TextDisplay: React.FC<TextDisplayProps> = ({
  label,
  textStyles,
  sampleText,
}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // For each text style key set the sample text for that key,
  // If the key is not found in the textStyles object, use the default text style

  return (
    <View style={{margin: 20}}>
      <Text
        style={{
          color: currentTheme.darkText,
          marginBottom: marginSizes.medium,
          paddingBottom: marginSizes.small,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.borders,
          ...headingTextStyles.xSmall,
        }}>
        {label}
      </Text>
      {Object.entries(textStyles).map(([key, style]) => (
        <Text
          key={key}
          style={{
            paddingVertical: marginSizes.small,
            color: currentTheme.text,
            ...style,
          }}>
          {key in sampleTexts ? sampleTexts[key] : 'Sample Text '}
          {key in sampleTexts ? '' : `(${key})`}
        </Text>
      ))}
    </View>
  );
};
const Template: Story<TextDisplayProps> = (args: any) => (
  <TextDisplay {...args} />
);

export const Heading = Template.bind({});
Heading.args = {
  label: 'Heading Styles',
  textStyles: headingTextStyles,
  sampleText: sampleTexts.heading,
};
export const Body = Template.bind({});
Body.args = {
  label: 'Body Styles',
  textStyles: bodyTextStyles,
  sampleText: sampleTexts.body,
};
export const CTA = Template.bind({});
CTA.args = {
  label: 'CTA Styles',
  textStyles: ctaTextStyles,
  sampleText: sampleTexts.cta,
};

const combineStyle = {
  heading: headingTextStyles.medium,
  body: bodyTextStyles.small,
  cta: ctaTextStyles.small,
};
export const Combined = Template.bind({});
Combined.args = {
  label: 'Combined Styles',
  textStyles: combineStyle,
  sampleText: 'Combined',
};
