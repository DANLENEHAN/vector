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
import {graphDataPoint} from '@services/timeSeries/Types';

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
  data: graphDataPoint[];
  averageValue: number | null;
  averageLabel: string;
  unit: string;
  maxYValue?: number;
  minYValue?: number;
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
  maxYValue,
  minYValue,
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
        // If the value is null i.e. no values.
        return '-';
      }
      return value;
    }
    // If graph not clicked
    // If the data is null i.e. no values.
    if (averageValue === null) {
      return '-';
    }
    return averageValue.toFixed(2);
  });

  const formatXLabel = (ms: number) => {
    const result = data.filter(d => d.index === ms);
    // If no data
    if (result.length == 0) {
      return '';
    }
    return result[0].axisLabel;
  };

  // Function sets the current date for the average value text component
  const currentDate = useDerivedValue(() => {
    // If graph clicked
    if (isFirstPressActive) {
      const currDate = data[firstPress.x.value.value].label;
      if (currDate === undefined || currDate === null) {
        return '-';
      }
      return currDate;
    }
    // If graph not clicked
    return averageLabel;
  });

  // Sets the axis domain for the graph
  const domain: {
    x: [number, number];
    y: [number, number] | undefined;
  } = {
    // If the graph has a max and min y value
    y:
      maxYValue !== undefined && minYValue !== undefined
        ? [minYValue, maxYValue]
        : undefined,
    // The x domain is the range of the data
    x: [0, data.length - 1],
  };

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
          xKey="index"
          yKeys={['value']}
          // Curve type
          curve="linear"
          domainPadding={{
            left: marginSizes.large,
            right: marginSizes.large,
            top: marginSizes.large,
            bottom: marginSizes.xSmall,
          }}
          domain={domain}
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
            formatXLabel: formatXLabel,
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
    flex: 4,
  },
  chartContainer: {
    flex: 15,
  },
});
