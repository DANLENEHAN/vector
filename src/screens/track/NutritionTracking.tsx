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
    label: 'Water',
    route: 'WaterTracking',
    icon: 'glass-water-droplet',
  },
];

/**
 * Nutrition Tracking Screen
 *
 * Uses context to manage themes and provides a scrollable view of clickable tiles
 * for different nutrition tracking options.
 *
 * @param {ScreenProps} navigation - Stack Navigation for navigating to different screens.
 * @returns {React.FC} - Nutrition Tracking Screen Component
 */
const NutritionTracking: React.FC<ScreenProps> = ({
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
        testID="nutrition-tracking-screen">
        <ScrollView contentContainerStyle={styles.scroll}>
          {tile_data.map(tile => (
            <ClickableTile
              key={tile.route} // Use unique identifier as key
              onPress={() => navigation.navigate(tile.route as 'WaterTracking')}
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
    flex: 1,
  },
  scroll: {
    ...layoutStyles.centerVertically,
  },
});

export default NutritionTracking;
