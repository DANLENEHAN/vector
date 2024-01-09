// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Styling
// @ts-ignore
import Montserrat from '../../../assets/fonts/Montserrat-SemiBold.ttf';
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  fontWeights,
  margins,
} from '../../styles/main';
//Services
import {useSystem} from '../../context/SystemContext';
// Components
import {
  CartesianChart,
  Line,
  useChartPressState,
  Scatter,
} from 'victory-native';
import {AnimatedText} from '../inputs/AnimatedText';
// Utils
import {
  useFont,
  Circle,
  vec,
  Line as SkiaLine,
} from '@shopify/react-native-skia';
import {format} from 'date-fns';
// Types
import {useDerivedValue, type SharedValue} from 'react-native-reanimated';

type graphData = {
  date: number;
  value: number;
};

interface LineGraphProps {
  data: graphData[];
  averageValue: number;
  averageLabel: string;
  unit: string;
}

const ToolTip = ({
  xPosition,
  yPosition,
  top,
  bottom,
  lineColor,
  indicatorColor,
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  bottom: number;
  top: number;
  lineColor: string;
  indicatorColor: string;
}) => {
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() => vec(xPosition.value, top));
  return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={2} />
      <Circle cx={xPosition} cy={yPosition} r={10} color={indicatorColor} />
      <Circle
        cx={xPosition}
        cy={yPosition}
        r={8}
        color="hsla(0, 0, 100%, 0.25)"
      />
    </>
  );
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatDate = (ms: number) => {
  'worklet';

  const date = new Date(ms);
  const M = MONTHS[date.getMonth()];
  const D = date.getDate();
  const Y = date.getFullYear();
  return `${D} ${M} ${Y}`;
};

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  averageLabel,
  averageValue,
  unit,
}) => {
  const INIT_STATE = {x: 0, y: {value: 0}} as const;
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const font = useFont(Montserrat, fontSizes.small);
  //const labelFont = useFont(MontserratBold, fontSizes.medium);
  const {state: firstPress, isActive: isFirstPressActive} =
    useChartPressState(INIT_STATE);

  const currentValue = useDerivedValue(() => {
    if (isFirstPressActive) {
      const value = firstPress.y.value.value.value.toFixed(2);
      if (value === undefined || value === null || value == 'NaN') {
        return '-';
      }
      return value;
    }
    return null;
  });

  const currentDate = useDerivedValue(() => {
    if (isFirstPressActive) {
      const idx = firstPress.x.value.value;
      if (idx === undefined || idx === null) {
        return null;
      }
      const currDate = formatDate(idx);
      return currDate;
    }
    return null;
  });
  console.log(data[0].date, new Date(data[0].date));

  return (
    <>
      <View style={{flex: 8}}>
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={['value']}
          curve="linear"
          domainPadding={{left: 20, right: 20, top: 20, bottom: 5}}
          padding={{top: 20, bottom: 20, left: 20, right: 20}}
          chartPressState={[firstPress]}
          axisOptions={{
            font: font,
            lineColor: currentTheme.borders,
            labelColor: {x: currentTheme.lightText, y: currentTheme.text},
            //labelPosition: { x: "outset", y: "inset" },
            formatXLabel: ms => format(new Date(ms), 'd MMM'),
          }}
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
              <Line
                connectMissingData
                points={points.value}
                color={currentTheme.primary}
                strokeWidth={3}
                animate={{type: 'timing', duration: 300}}
              />
              <Scatter
                points={points.value}
                color={currentTheme.background}
                radius={5}
                style={'fill'}
              />
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
      <View style={{flex: 2, alignItems: 'center', height: 50}}>
        {/* Use alternative text component if they are null */}
        {!isFirstPressActive ? (
          <View style={styles.averageWeightContainer}>
            <Text
              style={[
                styles.averageWeightLabel,
                {color: currentTheme.lightText, marginBottom: margins.xSmall},
              ]}>
              Average:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: margins.xSmall,
              }}>
              <Text
                style={[styles.averageWeightValue, {color: currentTheme.text}]}>
                {averageValue.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.averageWeightLabel,
                  {color: currentTheme.lightText, fontSize: fontSizes.large},
                ]}>
                {' '}
                {unit}
              </Text>
            </View>
            <Text
              style={[
                styles.averageWeightLabel,
                {color: currentTheme.lightText},
              ]}>
              {averageLabel}
            </Text>
          </View>
        ) : (
          <View style={styles.averageWeightContainer}>
            <Text
              style={[
                styles.averageWeightLabel,
                {color: currentTheme.lightText, marginBottom: margins.xSmall},
              ]}>
              Average:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: margins.xSmall,
              }}>
              <AnimatedText
                text={currentValue}
                style={[
                  styles.averageWeightValue,
                  {
                    color: currentTheme.text,
                    marginVertical: -margins.small,
                    marginHorizontal: -margins.xSmall,
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
                  marginVertical: -margins.small,
                  marginHorizontal: -margins.xSmall,
                },
              ]}
            />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chartView: {
    //height: 200,
    flex: 1,
  },
  valueContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  averageWeightContainer: {
    width: '90%',
    height: 100,
    //backgroundColor: 'red',
  },
  averageWeightLabel: {
    fontSize: fontSizes.medium,
  },
  averageWeightValue: {
    fontSize: fontSizes.xLarge,
    fontWeight: fontWeights.extraBold,
    color: 'black',
  },
});

export default LineGraph;
