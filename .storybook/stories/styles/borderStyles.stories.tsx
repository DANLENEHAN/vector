import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {Meta, Story} from '@storybook/react-native';
import {SystemProvider} from '../../../src/context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  layoutStyles,
  headingTextStyles,
  borderRadius,
  borderWidth,
} from '../../../src/styles/Main';
import {useSystem} from '../../../src/context/SystemContext';

export default {
  title: 'styles/BorderStyles',
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

const BorderStyleGrid: Story<any> = () => {
  // Generate an array of views with all permutations of borderRadius and borderWidth
  const borderStyles = Object.entries(borderRadius).flatMap(
    ([radiusKey, radiusValue]) =>
      Object.entries(borderWidth).map(([widthKey, widthValue]) => ({
        radiusKey,
        widthKey,
        radiusValue,
        widthValue,
      })),
  );
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {borderStyles.map(
        ({radiusKey, widthKey, radiusValue, widthValue}, index) => (
          <View
            key={index}
            style={[
              styles.box,
              {
                borderRadius: radiusValue,
                borderWidth: widthValue,
                borderColor: currentTheme.text,
              },
            ]}>
            <Text
              style={
                styles.text
              }>{`Radius: ${radiusKey}, Width: ${widthKey}`}</Text>
          </View>
        ),
      )}
    </ScrollView>
  );
};

export const Default = BorderStyleGrid.bind({});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  box: {
    height: 100,
    width: 100,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 10,
  },
});
