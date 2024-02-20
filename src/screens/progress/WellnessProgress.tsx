// React imports
import React from 'react';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
//Services
import {useSystem} from '@context/SystemContext';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import {ScreenProps} from '@screens/Types';
import {TileData} from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView} from 'react-native';
import ScreenWrapper from '@components/layout/ScreenWrapper';

// Data
const tile_data: TileData[] = [
  {
    label: 'Weight',
    icon: 'weight-scale',
    route: 'WeightProgress',
  },
  {
    label: 'Mood',
    icon: 'face-smile',
    route: 'MoodProgress',
  },
];

/**
 * Wellness Progress Screen
 *
 * @component WellnessProgressScreen
 *
 * @param {ScreenProps} navigation - Stack Navigation
 *
 * @returns {React.FC} - Wellness Progress Screen Component
 */
const WellnessProgressScreen: React.FC<ScreenProps> = ({
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
        testID="wellness-progress-screen">
        <ScrollView contentContainerStyle={styles.scroll}>
          {tile_data.map(tile => (
            <ClickableTile
              key={tile.route}
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
    height: '50%',
  },
  scroll: {
    flex: 1,
    ...layoutStyles.spaceBetweenVertical,
  },
});

export default WellnessProgressScreen;
