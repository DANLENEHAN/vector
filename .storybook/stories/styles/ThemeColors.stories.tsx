import React from 'react';
import {Meta, Story} from '@storybook/react-native';
import {View, Text, ColorValue, TouchableOpacity} from 'react-native';
import {SystemProvider} from '../../../src/context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  layoutStyles,
  headingTextStyles,
  bodyTextStyles,
  borderRadius,
  marginSizes,
} from '../../../src/styles/Main';

export default {
  title: 'styles/Themes',
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <View
          style={{
            flex: 1,
            ...layoutStyles.centerVertically,
          }}>
          <Story />
        </View>
      </SystemProvider>
    ),
  ],
} as Meta;

interface ThemeDisplayProps {
  label: string;
  themeColors: object;
}
interface ColourTileProps {
  color: string;
  borderColor: ColorValue;
  name: string;
}

const ColourTile: React.FC<ColourTileProps> = ({color, borderColor, name}) => {
  // Example usage
  const fontColor = isBackgroundColorTooDark(color) ? 'white' : 'black';

  return (
    <TouchableOpacity
      style={{
        height: 50,
        width: 120,
        margin: marginSizes.xSmall,
        backgroundColor: color,
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: borderRadius.medium,
        textAlign: 'center',
        ...layoutStyles.centerVertically,
      }}
      onFocus={() => {
        console.log(name);
      }}>
      <Text
        style={{
          color: fontColor,
          ...bodyTextStyles.xxSmall,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const ThemeDisplay: React.FC<ThemeDisplayProps> = ({label, themeColors}) => {
  const currentTheme =
    themeColors === darkThemeColors ? darkThemeColors : lightThemeColors;
  return (
    <View
      style={{
        margin: 20,
        backgroundColor: currentTheme.background,
        borderWidth: 1,
        borderColor: currentTheme.borders,
        borderRadius: borderRadius.medium,
        ...layoutStyles.centerVertically,
      }}>
      <Text
        style={{
          color: currentTheme.text,
          marginTop: marginSizes.small,
          ...headingTextStyles.xSmall,
        }}>
        {label}
      </Text>
      <View
        style={{
          flexWrap: 'wrap',
          ...layoutStyles.centerHorizontally,
        }}>
        {Object.entries(themeColors).map(([key, value]) => (
          <ColourTile
            key={key}
            name={key}
            borderColor={currentTheme.borders}
            color={value}
          />
        ))}
      </View>
    </View>
  );
};

// Converts a HEX color to its RGB components
function hexToRgb(hex: string): {r: number; g: number; b: number} {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return {r, g, b};
}

// Calculates the relative luminance of an RGB color
function getLuminance({r, g, b}: {r: number; g: number; b: number}): number {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// If the color is too dark, use white text using the YIQ equation
// Determines if the background color is too dark
function isBackgroundColorTooDark(bgHex: string): boolean {
  const bgColor = hexToRgb(bgHex);
  const luminance = getLuminance(bgColor);
  // Threshold can be adjusted based on desired contrast
  // Using 0.5 as a threshold for demonstration (not from WCAG)
  return luminance < 0.451;
}

const Template: Story<any> = args => (
  <ThemeDisplay label={args.label} themeColors={args.themeColors} />
);

export const Light = Template.bind({});
Light.args = {
  themeColors: lightThemeColors,
  label: 'Light Theme',
};
export const Dark = Template.bind({});
Dark.args = {
  themeColors: darkThemeColors,
  label: 'Dark Theme',
};
