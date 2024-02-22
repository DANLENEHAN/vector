// React imports
import React from 'react';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView} from 'react-native';
import ScreenWrapper from '@components/layout/ScreenWrapper';

// Types
import {ScreenProps} from '@screens/Types';
import {TileData} from '@components/buttons/ClickableTile';

// Data
const tile_data: TileData[] = [
  {
    label: 'Weight',
    icon: 'weight-scale',
    route: 'WeightTracking',
  },
  {
    label: 'Mood',
    icon: 'face-smile',
    route: 'MoodTracking',
  },
  {
    label: 'Muscle',
    icon: 'ruler',
    route: 'BodyMeasurementTracking',
  },
];

/**
 * Home screen for the wellness tracking section
 *
 * Provides a UI for navigating to different wellness tracking features.
 *
 * @param {ScreenProps} props - Props containing the navigation object for screen navigation
 * @returns {React.FC<ScreenProps>} The wellness tracking screen component
 */
const WellnessTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <ScreenWrapper>
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: currentTheme.background},
        ]}
        testID="wellness-tracking-screen">
        <ScrollView contentContainerStyle={styles.scroll}>
          {tile_data.map(tile => (
            <ClickableTile
              key={tile.route} // Use unique label for key
              onPress={() =>
                navigation.navigate(
                  tile.route as 'WeightProgress' | 'MoodProgress',
                )
              }
              label={tile.label}
              icon={tile.icon}
              lastTracked={tile.lastTracked}
              backgroundColor={tile.backgroundColor ?? currentTheme.primary}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '90%',
    width: '100%',
  },
  scroll: {
    flex: 1,
    ...layoutStyles.spaceAroundVertical,
  },
});

export default WellnessTracking;
