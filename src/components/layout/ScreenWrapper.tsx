// React Import
import React from 'react';
import {StyleSheet} from 'react-native';
// Theme
import {darkThemeColors, lightThemeColors} from '../../styles/main';
import {useSystem} from '../../context/SystemContext';
//
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({children}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider
      style={[
        styles.screenWrapper,
        {
          backgroundColor: currentTheme.background,
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      {children}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenWrapper;
