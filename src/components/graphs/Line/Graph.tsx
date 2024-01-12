// React imports
import React from 'react';
// Styling
// @ts-ignore
import Montserrat from '../../../../assets/fonts/Montserrat-SemiBold.ttf';
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  margins,
} from '@styles/main';
//Services
import {useSystem} from '@context/SystemContext';
// Components
import {View, StyleSheet} from 'react-native';
import {
  CartesianChart,
  Line,
  useChartPressState,
  Scatter,
} from 'victory-native';
import ToolTip from '@components/graphs/Line/Tooltip';
import {AverageValueText} from '@components/graphs/Line/AverageValue';
// Utils
import {useFont} from '@shopify/react-native-skia';
import {format} from 'date-fns';
// Types
import {useDerivedValue} from 'react-native-reanimated';
import {graphDataPoint} from '@components/graphs/Line/types';

interface LineGraphProps {
  data: graphDataPoint[]; // The data to be displayed on the graph
  averageValue: number; // The average value of the data
  averageLabel: string; // The label for the average value
  unit: string; // The unit for the average value
}

// Functions necessary for the parsing of the date when the graph is clicked
const formatDate = (ms: number): string => {
  'worklet';

  const date = new Date(ms);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const dateFormatter = new Intl.DateTimeFormat('en-GB', options);

  return dateFormatter.format(date);
};

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  averageLabel,
  averageValue,
  unit,
}) => {
  //// Variables
  // Needed for chart press state
  const INIT_STATE = {x: 0, y: {value: 0}} as const;
  const {state: firstPress, isActive: isFirstPressActive} =
    useChartPressState(INIT_STATE);
  // Needed for theme
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  // Needed for font for Victory Charts
  const font = useFont(Montserrat, fontSizes.small);

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
      const idx = firstPress.x.value.value;
      if (idx === undefined || idx === null) {
        return '-';
      }
      const currDate = formatDate(idx);
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
    <>
      <View style={styles.AverageValueTextContainer}>
        <AverageValueText
          currentValue={currentValue}
          currentDate={currentDate}
          unit={unit}
        />
      </View>
      <View style={styles.ChartContainer}>
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={['value']}
          // Curve type
          curve="linear"
          // Padding within the chart
          domainPadding={{
            left: margins.large,
            right: margins.large,
            top: margins.large,
            bottom: margins.xSmall,
          }}
          // Padding outside the chart
          padding={{
            top: margins.large,
            bottom: margins.large,
            left: margins.large,
            right: margins.large,
          }}
          chartPressState={[firstPress]}
          axisOptions={{
            font: font,
            lineColor: currentTheme.borders,
            labelColor: {x: currentTheme.text, y: currentTheme.text},
            // Function converts the date to a string
            formatXLabel: ms => format(new Date(ms), 'd MMM'),
          }}
          // Render the tooltip if the graph is clicked
          renderOutside={({chartBounds}) => (
            <>
              {isFirstPressActive && (
                <>
                  <ToolTip
                    xPosition={firstPress.x.position}
                    yPosition={firstPress.y.value.position}
                    bottom={chartBounds.bottom}
                    top={chartBounds.top}
                    lineColor={currentTheme.secondary}
                    indicatorColor={currentTheme.secondary}
                  />
                </>
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
    </>
  );
};

export default LineGraph;

const styles = StyleSheet.create({
  AverageValueTextContainer: {
    alignItems: 'center',
    height: 90,
  },
  ChartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
