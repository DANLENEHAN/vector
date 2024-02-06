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
 * Props for the WorkoutProgressScreen component.
 *
 * @interface WorkoutProgressScreenProps
 *
 * @param {RouteProp<RootStackParamList, any>} route - Route object for the screen.
 */
interface WorkoutProgressScreenProps {
  route: RouteProp<RootStackParamList>;
}

/**
 *  Workout Progress screen
 *
 * @component WorkoutProgress
 * @param {any} route - Route object for the screen
 *
 * @returns {React.FC} - Returns the workout progress screen component
 *
 * @example
 * <WorkoutProgress route={route}/>
 */
const WokroutProgressScreen: React.FC<WorkoutProgressScreenProps> = ({
  route,
}: WorkoutProgressScreenProps): React.ReactElement<WorkoutProgressScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ScreenWrapper>
      <View style={styles.content} testID="workout-progress-screen">
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

export default WokroutProgressScreen;
