// React imports
import React from 'react';
// Components
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import ScreenWrapper from '@components/layout/ScreenWrapper';
// Styling
import {fontSizes, lightThemeColors, darkThemeColors} from '@styles/Main';
//Services
import {useSystem} from '@context/SystemContext';
// Types
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '@navigation/Types';
/**
 * Props for the WorkoutScreen component.
 *
 * @interface WorkoutScreenProps
 *
 * @param {RouteProp<RootStackParamList, any>} route - Route object for the screen.
 */
interface WorkoutScreenProps {
  route: RouteProp<RootStackParamList>;
}

/**
 * WorkoutScreen Component
 *
 * @component WorkoutScreen
 * @param {Object} props - Component props
 * @returns {React.FC} - React Component
 */
const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  route,
}: WorkoutScreenProps): React.ReactElement<WorkoutScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScreenWrapper>
      <View style={styles.content} testID="workout-tracking-screen">
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
