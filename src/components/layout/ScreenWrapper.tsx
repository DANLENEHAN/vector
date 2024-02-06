// React Import
import React from 'react';
import {View, StyleSheet} from 'react-native';
// Theme
import {darkThemeColors, lightThemeColors} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Layout
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
// Styling
import {layoutStyles} from '@styles/Main';

/**
 * Interface for the ScreenWrapper component
 * @interface ScreenWrapperProps
 *
 * @param {React.ReactNode} children - The children to be rendered inside the component
 */
interface ScreenWrapperProps {
  children: React.ReactNode;
}

/**
 * Screen Wrapper Component
 *
 * @component ScreenWrapper
 * @example
 * <ScreenWrapper>
 *    <Text>Example</Text>
 * </ScreenWrapper>
 *
 * @param {Object} props - Component Screen Wrapper Props
 * @returns {React.FC<ScreenWrapperProps>} - React Component
 */
const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
}: ScreenWrapperProps): React.ReactElement<ScreenWrapperProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider
      style={[
        layoutStyles.centerVertically,
        {
          backgroundColor: currentTheme.background,
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <View style={styles.parentContainer}>{children}</View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    width: '100%',
    flex: 1,
  },
});
export default ScreenWrapper;
