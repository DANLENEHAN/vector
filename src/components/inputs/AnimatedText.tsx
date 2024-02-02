// React Native Import
import * as React from 'react';
// Components
import {TextInput, type TextInputProps} from 'react-native';
// Types
import Reanimated, {
  useAnimatedProps,
  type SharedValue,
} from 'react-native-reanimated';

const AnimText = Reanimated.createAnimatedComponent(TextInput);
Reanimated.addWhitelistedNativeProps({text: true});

type AnimatedTextProps = Omit<TextInputProps, 'editable' | 'value'> & {
  text: SharedValue<string>;
  style?: React.ComponentProps<typeof AnimText>['style'];
};

/**
 * Animated Text Component
 *
 * @component AnimatedText
 * @example
 * <AnimatedText
 *   text={text}
 *   style={{color: 'red'}}
 * />
 *
 * @param {Object} props - Component Animated Text Props
 * @returns {React.FC<AnimatedTextProps>} - React Component
 */
export function AnimatedText({
  text,
  ...rest
}: AnimatedTextProps): React.ReactElement {
  const animProps = useAnimatedProps(() => {
    return {
      text: text.value,
    };
  });

  return (
    <AnimText
      {...rest}
      value={text.value}
      // @ts-ignore
      animatedProps={animProps}
      editable={false}
    />
  );
}
