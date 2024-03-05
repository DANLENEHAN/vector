// React Import
import React from 'react';
// Theme
import {
  darkThemeColors,
  lightThemeColors,
  marginSizes,
  bodyTextStyles,
  headingTextStyles,
  layoutStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import {AnimatedText} from '@components/inputs/AnimatedText';
import {StyleSheet, View, Text} from 'react-native';
// Typing
import {type SharedValue} from 'react-native-reanimated';

/**
 * Interface for the AverageValueText component
 *
 * @interface AverageValueText
 *
 * @param {string} unit - The unit for the average value
 * @param {SharedValue<string>} currentValue - The current value of the graph
 * @param {SharedValue<string>} currentDate - The current date of the graph
 * @param {boolean} loading - Whether the graph is loading
 */
interface AverageValueText {
  unit: string;
  currentValue: SharedValue<string>;
  currentDate: SharedValue<string>;
  loading?: boolean;
}

/**
 * Average Value Text Component
 *
 * @component AverageValueText
 * @param {Object} props - Component Average Value Text Props
 * @returns {React.FC<AverageValueText>} - React Component
 */
export const AverageValueText: React.FC<AverageValueText> = ({
  currentValue,
  currentDate,
  unit,
  loading,
}): React.ReactElement<AverageValueText> => {
  // Setup theme for the component
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const topLabel = loading ? '' : 'Average:';
  const unitLabel = loading ? '' : unit;
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
    <View style={styles.componentWrapper}>
      <Text
        style={[
          styles.header,
          {color: currentTheme.lightText, marginBottom: marginSizes.xSmall},
        ]}>
        {topLabel}
      </Text>

      <View style={styles.averageContainer}>
        <AnimatedText
          text={currentValue}
          style={[
            styles.averageValueLabel,
            {
              color: currentTheme.text,
            },
          ]}
        />
        <Text style={[styles.unitLabel, {color: currentTheme.lightText}]}>
          {` ${unitLabel}`}
        </Text>
      </View>

      <AnimatedText
        text={currentDate}
        style={[
          styles.averageDatePeriod,
          {
            color: currentTheme.lightText,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    flex: 1,
    marginLeft: marginSizes.large,
    ...layoutStyles.flexStretchVertical,
  },
  header: {
    ...bodyTextStyles.small,
  },
  averageContainer: {
    ...layoutStyles.flexStartHorizontal,
  },
  unitLabel: {
    ...bodyTextStyles.small,
  },
  averageDatePeriod: {
    ...bodyTextStyles.small,
  },
  averageValueLabel: {
    ...headingTextStyles.small,
  },
});
