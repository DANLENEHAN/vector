// React Import
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
// Theme
import {
  darkThemeColors,
  lightThemeColors,
  margins,
  fontSizes,
  fontWeights,
} from '../../../styles/main';
import {useSystem} from '../../../context/SystemContext';
// Components
import {AnimatedText} from '../../inputs/AnimatedText';
// Typing
import {type SharedValue} from 'react-native-reanimated';

interface AverageValueText {
  unit: string; // The unit for the average value
  currentValue: SharedValue<string>; // The current value of the graph
  currentDate: SharedValue<string>; // The current date of the graph
}

export const AverageValueText: React.FC<AverageValueText> = ({
  currentValue,
  currentDate,
  unit,
}) => {
  // Setup theme for the component
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Render the component
  /**
   * Returns AverageValueText component with the following props:
   * Component:
   * Label at the top of the component (Average:)
   * Value in the middle of the component (currentValue) with the unit (unit)
   * Date at the bottom of the component (currentDate)
   *
   * These values are animated using the AnimatedText component
   */
  return (
    <View style={styles.averageWeightContainer}>
      <Text
        style={[
          styles.averageLabel,
          {color: currentTheme.lightText, marginBottom: margins.xSmall},
        ]}>
        Average:
      </Text>
      <View style={styles.averageWeightAndUnitContainer}>
        <AnimatedText
          text={currentValue}
          style={[
            styles.averageValue,
            {
              color: currentTheme.text,
            },
          ]}
        />
        <Text
          style={[
            styles.averageWeightLabel,
            {color: currentTheme.lightText, fontSize: fontSizes.large},
          ]}>
          {' '}
          {unit}
        </Text>
      </View>

      <AnimatedText
        text={currentDate}
        style={[
          styles.averageWeightLabel,
          {
            color: currentTheme.lightText,
            marginTop: -margins.small,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartView: {
    //height: 200,
    flex: 1,
  },
  averageLabel: {
    fontSize: fontSizes.small,
  },
  valueContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  averageWeightContainer: {
    width: '90%',
    height: 100,
    //backgroundColor: 'red',
  },
  averageWeightLabel: {
    fontSize: fontSizes.medium,
  },
  averageWeightAndUnitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margins.small,
  },
  averageValue: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.ultraBold,
    color: 'black',
  },
});
