// React Imports
import React from 'react';
// Types
import {useDerivedValue, type SharedValue} from 'react-native-reanimated';
import {Circle, vec, Line as SkiaLine} from '@shopify/react-native-skia';

/**
 * Interface for the ToolTip component
 *
 * @interface ToolTipProps
 *
 * @param {SharedValue<number>} xPosition - Location of the tooltip on the x-axis
 * @param {SharedValue<number>} yPosition - Location of the tooltip on the y-axis
 * @param {number} bottom - Bottom of the graph
 * @param {number} top - Top of the graph
 * @param {string} lineColor - Color of the line
 * @param {string} indicatorColor - Color of the indicator
 */
interface ToolTipProps {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  bottom: number;
  top: number;
  lineColor: string;
  indicatorColor: string;
}

/**
 * ToolTip Component
 *
 * @component ToolTip
 * @param {Object} props - Component ToolTip Props
 * @returns {React.FC<ToolTipProps>} - React Component
 */
const ToolTip: React.FC<ToolTipProps> = ({
  xPosition,
  yPosition,
  top,
  bottom,
  lineColor,
  indicatorColor,
}: ToolTipProps): React.ReactElement<ToolTipProps> => {
  // Start and end points of the line
  /**
   * useDerivedValue: The useDerivedValue hook is used to
   * create a derived value that can be recomputed whenever
   * one of its dependencies changes.
   *
   * vec: The vectors below represent the position on the graph
   * for the start and end points of the line.
   *  */
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() => vec(xPosition.value, top));

  // Return the tooltip
  /**
   *
   * Returns the tooltip with the line and indicator
   * Components:
   * - SkiaLine: A line drawn using Skia using the lineColor
   * - Larger Circle: A circle drawn using Skia using the indicatorColor
   * - Smaller Circle: A circle drawn using Skia with a low opacity grey color
   */
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

export default ToolTip;
