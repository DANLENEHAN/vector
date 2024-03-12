// React imports
import React from 'react';
// Styling
// @ts-ignore
import Lato from '../../../../assets/fonts/Lato-Regular.ttf';
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  marginSizes,
  borderRadius,
  headingTextStyles,
  layoutStyles,
  iconSizes,
} from '@styles/Main';
// Services
import {useSystem} from '@context/SystemContext';
// Components
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  CartesianChart,
  Line,
  Bar,
  useChartPressState,
  Scatter,
} from 'victory-native';
import ToolTip from '@components/visualisations/graphs/Tooltip';
import {AverageValueText} from '@components/visualisations/graphs/AverageValue';
// Utils
import {useFont} from '@shopify/react-native-skia';
// Types
import {useDerivedValue} from 'react-native-reanimated';
import {graphDataPoint, statisticType} from '@services/timeSeries/Types';
// Constants
import {maxValuePadding} from '@services/timeSeries/Constants';

/**
 * Interface for the LineGraph component
 *
 * @interface GraphProps
 *
 * @param {graphDataPoint[]} data - The data to be displayed on the graph
 * @param {number} averageValue - The average value of the data
 * @param {string} averageLabel - The label for the average value
 * @param {string} unit - The unit for the average value
 * @param {'bar' | 'line'} chartType - The type of chart to be displayed
 * @param {number} maxYValue - The maximum y value for the graph
 * @param {number} minYValue - The minimum y value for the graph
 * @param {boolean} showUnit - Whether to show the unit on the average value
 * @param {boolean} loading - Whether the graph is loading
 */
interface GraphProps {
  data: graphDataPoint[];
  displayValue: number | null | string;
  displayLabel: string;
  unit: string;
  chartType: 'bar' | 'line';
  maxYValue?: number;
  minYValue?: number;
  showUnit?: boolean;
  loading?: boolean;
  statisticType: statisticType;
}

/**
 *  Graph Component
 *
 * @component Graph
 * @param {Object} props - Component Graph Props
 * @returns {React.FC<LineGraphProps>} - React Component
 */
const Graph: React.FC<GraphProps> = ({
  data,
  displayLabel,
  displayValue,
  unit,
  maxYValue,
  minYValue,
  chartType = 'line',
  statisticType,
  showUnit,
  loading,
}): React.ReactElement<GraphProps> => {
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
    if (displayValue === null) {
      return '-';
    }
    // If average value is a string
    if (typeof displayValue === 'string') {
      return displayValue;
    }
    return displayValue.toFixed(2);
  });

  const formatXLabel = (ms: number) => {
    const result = data.filter(d => d.index === ms);
    // If no data
    if (result.length === 0) {
      return '';
    }
    return result[0].axisLabel;
  };

  // Function sets the current date for the average value text component
  const currentDate = useDerivedValue(() => {
    // If graph clicked
    if (isFirstPressActive) {
      if (
        firstPress.x.value.value === undefined ||
        firstPress.x.value.value === null ||
        data.length === 0
      ) {
        return '-';
      }
      const currDate = data[firstPress.x.value.value].label;
      if (currDate === undefined || currDate === null) {
        return '-';
      }
      return currDate;
    }
    // If graph not clicked
    return displayLabel;
  });

  const getYBounds = (
    minYVal: number | undefined,
    maxYVal: number | undefined,
  ): [number, number] => {
    // If the graph has a max and min y value
    if (minYVal !== undefined && maxYVal !== undefined) {
      return [minYVal, maxYVal];
    }
    const yValues = data.map(d => d.value || 0);
    // If the graph has no y values return 0 and the max value
    if (yValues.length === 0) {
      return [0, maxValuePadding];
    }
    // If the graph has no min y value
    if (minYVal === undefined && maxYVal !== undefined) {
      return [0, maxYVal];
    }
    // If the graph has no max y value
    if (minYVal !== undefined && maxYVal === undefined) {
      return [minYVal, Math.max(...yValues) + maxValuePadding];
    }
    return [0, Math.max(...yValues) + maxValuePadding];
  };

  // Sets the axis domain for the graph
  const domain: {
    x: [number, number];
    y: [number, number] | undefined;
  } = {
    y: getYBounds(minYValue, maxYValue),
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
    <View>
      <View style={layoutStyles.spaceBetweenHorizontal}>
        <AverageValueText
          currentValue={currentValue}
          currentDate={currentDate}
          unit={unit && showUnit ? unit : ''}
          loading={loading}
          statType={statisticType}
        />
        <TouchableOpacity
          style={{
            paddingRight: marginSizes.large,
          }}>
          <Icon
            name="ellipsis-vertical"
            size={iconSizes.large}
            color={currentTheme.text}
          />
        </TouchableOpacity>
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
              {isFirstPressActive && data.length > 0 && (
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
          {({points, chartBounds}) =>
            chartType === 'bar' ? (
              <Bar
                chartBounds={chartBounds}
                points={points.value}
                roundedCorners={{
                  topLeft: borderRadius.medium,
                  topRight: borderRadius.medium,
                }}
                color={currentTheme.primary}
              />
            ) : (
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
            )
          }
        </CartesianChart>
        {
          // Overlay if no data is available
          !loading &&
            (!data ||
              (data.length === 0 && (
                <View style={styles.overlayContainer}>
                  <Text
                    style={[styles.overlayText, {color: currentTheme.text}]}>
                    No Data Available
                  </Text>
                </View>
              )))
        }
        {loading && (
          <View style={styles.overlayContainer}>
            <ActivityIndicator size={70} color={currentTheme.primary} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  chartContainer: {
    height: 300,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject, // Make overlay cover the chart container completely
    ...layoutStyles.centerVertically,
    backgroundColor: 'transparent',
  },
  overlayText: {
    ...headingTextStyles.xSmall,
  },
});
