import React from 'react';
import {View, StyleSheet} from 'react-native';

import {darkThemeColors, lightThemeColors} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({children}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[
        styles.screenWrapper,
        {
          backgroundColor: currentTheme.background,
        },
      ]}>
      {children}
    </View>
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
