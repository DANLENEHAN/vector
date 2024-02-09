// React imports
import React from 'react';
import {Text} from 'react-native';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  headingTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Types
import {TileData} from '@components/buttons/ClickableTile';
import {ScreenProps} from '@screens/Types';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView} from 'react-native';

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
 *
 * @param {ScreenProps} navigation - Stack Navigation
 *
 * @returns {React.FC} - Nutrition Progress Screen Component
 *
 * @example
 * <NutritionProgressScreen navigation={navigation}/>
 */
const NutritionProgressScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[styles.mainContainer, {backgroundColor: currentTheme.background}]}
      testID="nutrition-progress-screen">
      <View style={styles.header}>
        <Text style={[styles.pageHeading, {color: currentTheme.text}]}>
          Nutrition
        </Text>
      </View>
      <View style={styles.scrollContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  pageHeading: {
    ...headingTextStyles.small,
  },
  scrollContainer: {
    flex: 9,
  },
  scroll: {
    ...layoutStyles.spaceAroundHorizontal,
  },
});

export default NutritionProgressScreen;
