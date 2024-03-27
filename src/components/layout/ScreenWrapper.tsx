// React Import
import React from 'react';
import {StyleSheet} from 'react-native';
// Theme
import {darkThemeColors, lightThemeColors} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Layout
import {SafeAreaView} from 'react-native-safe-area-context';

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
 * @param {Object} props - Component Screen Wrapper Props
 * @returns {React.FC<ScreenWrapperProps>} - React Component
 */
const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
}: ScreenWrapperProps): React.ReactElement<ScreenWrapperProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <SafeAreaView
      style={[
        styles.screenWrapperContainer,
        {
          backgroundColor: currentTheme.background,
        },
      ]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenWrapperContainer: {
    flex: 1,
  },
});
export default ScreenWrapper;
