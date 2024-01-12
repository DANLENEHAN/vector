// React imports
import React from 'react';
// Components
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {fontSizes, lightThemeColors, darkThemeColors} from '@styles/main';
//Services
import {useSystem} from '@context/SystemContext';

/**
 * WorkoutScreen Component
 *
 * @component WorkoutScreen
 * @param {Object} props - Component props
 * @returns {React.FC} - React Component
 */
const WorkoutScreen: React.FC<any> = ({route}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Text style={{color: currentTheme.text}}>{route.name}</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.xLarge,
  },
});

export default WorkoutScreen;
