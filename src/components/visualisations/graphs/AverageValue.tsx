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
import {useDerivedValue, type SharedValue} from 'react-native-reanimated';
import {WeightUnit} from '@services/api/swagger/data-contracts';
// Constants
import {StatisticLabels} from '@services/timeSeries/Constants';
import {statisticType} from '@services/timeSeries/Types';
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
  statType: statisticType;
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
  statType,
}): React.ReactElement<AverageValueText> => {
  // Setup theme for the component
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const topLabel = loading ? '' : StatisticLabels[statType];

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

  const isStone = unit === WeightUnit.Stone;

  const getStoneValue = useDerivedValue(() => {
    if (isStone) {
      const stoneValue = parseFloat(currentValue.value);
      if (stoneValue === null || isNaN(stoneValue)) {
        return currentValue.value;
      }
      return Math.floor(stoneValue).toString();
    }
    return currentValue.value;
  });
  const getPoundValue = useDerivedValue(() => {
    if (isStone) {
      const stoneValue = parseFloat(currentValue.value);
      if (stoneValue === null || isNaN(stoneValue)) {
        return currentValue.value;
      }
      return ((stoneValue - Math.floor(stoneValue)) * 14).toFixed(2);
    }
    return currentValue.value;
  });

  return (
    <View style={styles.componentWrapper}>
      <Text
        style={[
          styles.header,
          {
            color: currentTheme.lightText,
          },
        ]}>
        {topLabel}
      </Text>
      <View style={styles.averageContainer}>
        <AnimatedText
          text={getStoneValue}
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

        {isStone && (
          <>
            <AnimatedText
              text={getPoundValue}
              style={[
                styles.averageValueLabel,
                {
                  marginLeft: marginSizes.xSmall,
                  color: currentTheme.text,
                },
              ]}
            />
            <Text style={[styles.unitLabel, {color: currentTheme.lightText}]}>
              lbs
            </Text>
          </>
        )}
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
    marginLeft: marginSizes.large,
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
