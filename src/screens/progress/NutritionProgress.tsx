// React imports
import React from 'react';
// Styling
import {lightThemeColors, darkThemeColors, layoutStyles} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Types
import {TileData} from '@components/buttons/ClickableTile';
import {ScreenProps} from '@screens/Types';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView} from 'react-native';
import ScreenWrapper from '@components/layout/ScreenWrapper';

// Data
const tile_data: TileData[] = [
  {
    label: 'Water',
    route: 'WaterProgress',
    icon: 'glass-water-droplet',
  },
];

/**
 * Nutrition Progress Screen
 *
 * @component NutritionProgressScreen
 * @param {ScreenProps} navigation - Stack Navigation
 * @returns {React.FC} - Nutrition Progress Screen Component
 */
const NutritionProgressScreen: React.FC<ScreenProps> = ({
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
        testID="nutrition-progress-screen">
        <ScrollView contentContainerStyle={styles.scroll}>
          {tile_data.map((tile, index) => (
            <ClickableTile
              key={index}
              onPress={() => navigation.navigate(tile.route as 'WaterProgress')}
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
    height: '30%',
  },
  scroll: {
    flex: 1,
    ...layoutStyles.centerHorizontally,
  },
});

export default NutritionProgressScreen;
