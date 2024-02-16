// React imports
import React from 'react';
// Styling
// @ts-ignore
import Lato from '../../../../../assets/fonts/Lato-Regular.ttf';
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  marginSizes,
} from '@styles/Main';
// Services
import {useSystem} from '@context/SystemContext';
// Components
import {View, StyleSheet} from 'react-native';
import {
  CartesianChart,
  Line,
  useChartPressState,
  Scatter,
} from 'victory-native';
import ToolTip from '@components/visualisations/graphs/Line/Tooltip';
import {AverageValueText} from '@components/visualisations/graphs/Line/AverageValue';
// Utils
import {useFont} from '@shopify/react-native-skia';
// Types
import {useDerivedValue} from 'react-native-reanimated';
import {graphDataPoint} from '@components/visualisations/graphs/Line/Types';

/**
 * Interface for the LineGraph component
 *
 * @interface LineGraphProps
 *
 * @param {graphDataPoint[]} data - The data to be displayed on the graph
 * @param {number} averageValue - The average value of the data
 * @param {string} averageLabel - The label for the average value
 * @param {string} unit - The unit for the average value
 */
interface LineGraphProps {
  data: graphDataPoint[]; // The data to be displayed on the graph
  averageValue: number; // The average value of the data
  averageLabel: string; // The label for the average value
  unit: string; // The unit for the average value
}

/**
 *  Line Graph Component
 *
 * @component LineGraph
 * @param {Object} props - Component Line Graph Props
 * @returns {React.FC<LineGraphProps>} - React Component
 */
const LineGraph: React.FC<LineGraphProps> = ({
  data,
  averageLabel,
  averageValue,
  unit,
}: LineGraphProps): React.ReactElement<LineGraphProps> => {
  const INIT_STATE = {x: 0, y: {value: 0}} as const;
  const {state: firstPress, isActive: isFirstPressActive} =
    useChartPressState(INIT_STATE);
  // Needed for theme
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  // Needed for font for Victory Charts
  const font = useFont(Lato, fontSizes.xxSmall);

  //// Functions
  // Function sets the current value for the average value text component
  const currentValue = useDerivedValue(() => {
    // If graph clicked
    if (isFirstPressActive) {
      const value = firstPress.y.value.value.value.toFixed(2);
      if (value === undefined || value === null || value === 'NaN') {
        return '-';
      }
      return value;
    }
    // If graph not clicked
    return averageValue.toFixed(2);
  });

  // Function sets the current date for the average value text component
  const currentDate = useDerivedValue(() => {
    // If graph clicked
    if (isFirstPressActive) {
      const currDate = data[firstPress.x.value.value].dateStr;
      if (currDate === undefined || currDate === null) {
        return '-';
      }
      return currDate;
    }
    // If graph not clicked
    return averageLabel;
  });

  //// Return
  /**
   *  Returns LineGraph component with the following props:
   * Component:
   * AverageValueText: component showing global average if graph not clicked
   * or showing the value and date of the graph point clicked
   * CartesianChart: component showing the graph, contains tooltip component if graph clicked
   *
   *  */
  return (
    <View style={styles.componentWrapper}>
      <View style={styles.averageValueContainer}>
        <AverageValueText
          currentValue={currentValue}
          currentDate={currentDate}
          unit={unit}
        />
      </View>
      <View style={styles.chartContainer}>
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={['value']}
          // Curve type
          curve="linear"
          domainPadding={{
            left: marginSizes.large,
            right: marginSizes.large,
            top: marginSizes.large,
            bottom: marginSizes.xSmall,
          }}
          // Padding outside the chart
          padding={{
            top: marginSizes.large,
            bottom: marginSizes.large,
            left: marginSizes.large,
            right: marginSizes.large,
          }}
          chartPressState={[firstPress]}
          axisOptions={{
            font: font,
            lineColor: currentTheme.borders,
            labelColor: {x: currentTheme.text, y: currentTheme.text},
            formatXLabel: ms => data[ms].dateStr,
          }}
          // Render the tooltip if the graph is clicked
          renderOutside={({chartBounds}) => (
            <>
              {isFirstPressActive && (
                <ToolTip
                  xPosition={firstPress.x.position}
                  yPosition={firstPress.y.value.position}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                  lineColor={currentTheme.secondary}
                  indicatorColor={currentTheme.secondary}
                />
              )}
            </>
          )}>
          {({points}) => (
            <>
              {
                // Render the line
              }
              <Line
                connectMissingData
                points={points.value}
                color={currentTheme.primary}
                strokeWidth={3}
                animate={{type: 'timing', duration: 300}}
              />
              {
                // Render the inner points
              }
              <Scatter
                points={points.value}
                color={currentTheme.background}
                radius={5}
                style={'fill'}
              />
              {
                // Render the outer points
              }
              <Scatter
                points={points.value}
                color={currentTheme.primary}
                radius={5}
                style={'stroke'}
                strokeWidth={4}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

export default LineGraph;

const styles = StyleSheet.create({
  componentWrapper: {
    flex: 1,
  },
  averageValueContainer: {
    flex: 2,
  },
  chartContainer: {
    flex: 19,
  },
});
