// React imports
import React from 'react';
import {Text} from 'react-native';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  headingStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView} from 'react-native';
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
 * @component NutritionTracking
 *
 * @param {ScreenProps} navigation - Stack Navigation
 *
 * @returns {React.FC} - Nutrition Tracking Screen Component
 *
 * @example
 * <NutritionTracking navigation={navigation}/>
 */
const NutritionTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View
      style={[styles.mainContainer, {backgroundColor: currentTheme.background}]}
      testID="nutrition-tracking-screen">
      <View style={styles.header}>
        <Text
          style={[headingStyles.headingPrimary, {color: currentTheme.text}]}>
          Nutrition
        </Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {tile_data.map((tile, index) => (
            <ClickableTile
              key={index}
              onPress={() => navigation.navigate(tile.route as 'WaterTracking')}
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
  scrollContainer: {
    flex: 9,
  },
  scroll: {
    ...layoutStyles.spaceAroundHorizontal,
  },
});

export default NutritionTracking;
