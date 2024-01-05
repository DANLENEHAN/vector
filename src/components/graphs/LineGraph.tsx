// React imports
import React from 'react';
// Styling
import Montserrat from '../../../assets/fonts/Montserrat-SemiBold.ttf';
import {fontSizes, lightThemeColors, darkThemeColors} from '../../styles/main';
//Services
import {useTheme} from '../../context/ThemeContext';
// Components
import {
  CartesianChart,
  Line,
  useChartPressState,
  Scatter,
} from 'victory-native';
// Utils
import {useFont, Circle, vec, Text} from '@shopify/react-native-skia';
import {Line as SkiaLine} from '@shopify/react-native-skia';
import {format} from 'date-fns';
// Types
import type {SharedValue} from 'react-native-reanimated';

type graphData = {
  date: number;
  value: number;
};

interface LineGraphProps {
  data: graphData[];
}

const LineGraph: React.FC<LineGraphProps> = ({data}) => {
  const INIT_STATE = {x: 0, y: {value: 0}} as const;
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const font = useFont(Montserrat, fontSizes.small);

  const {state: firstPress, isActive: isFirstPressActive} =
    useChartPressState(INIT_STATE);

  function ToolTip({x, y}: {x: SharedValue<number>; y: SharedValue<number>}) {
    return (
      <SkiaLine
        p1={vec(x.value, y.value + 10)}
        p2={vec(x.value, y.value - 10)}
        color="lightblue"
        style="stroke"
        strokeWidth={4}
      />
    );
  }
  function ToolTipText({
    x,
    y,
  }: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  }) {
    return (
      <Text
        x={x}
        y={y.value + 50}
        text="Hello World"
        // Font is optional
        font={font}
      />
    );
  }
  function ToolTipCircle({
    x,
    y,
  }: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  }) {
    return <Circle cx={x} cy={y} r={10} color={currentTheme.secondary} />;
  }

  return (
    <CartesianChart
      data={data}
      xKey="date"
      yKeys={['value']}
      curve="natural"
      domainPadding={{left: 20, right: 20, top: 20, bottom: 5}}
      padding={{top: 20, bottom: 20, left: 20, right: 20}}
      chartPressState={[firstPress]}
      axisOptions={{
        font: font,
        lineColor: currentTheme.borders,
        labelColor: {x: currentTheme.lightText, y: currentTheme.lightText},
        formatXLabel: ms => format(new Date(ms), 'dd/MM'),
      }}>
      {({points}) => (
        <>
          <Line
            points={points.value}
            color={currentTheme.primary}
            strokeWidth={3}
            animate={{type: 'timing', duration: 300}}
            curveType="cardinal"
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
          {isFirstPressActive && (
            <>
              <ToolTip
                x={firstPress.x.position}
                y={firstPress.y.value.position}
              />
              <ToolTipCircle
                x={firstPress.x.position}
                y={firstPress.y.value.position}
              />
              <ToolTipText
                x={firstPress.x.position}
                y={firstPress.y.value.position}
              />
            </>
          )}
        </>
      )}
    </CartesianChart>
  );
};

export default LineGraph;
