// React imports
import React from 'react';
// Styling
import {lightThemeColors, darkThemeColors} from '@styles/main';
import {useSystem} from '@context/SystemContext';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import Header from '@components/navbar/Header';
import {View, StyleSheet, ScrollView} from 'react-native';
// Types
import {ScreenProps} from '@screens/types';
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
const NutritionTracking: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={[styles.wrapper, {backgroundColor: currentTheme.background}]}>
      <Header
        label="Nutrition"
        navigation={navigation}
        includeBackArrow={false}
        includeTopMargin={false}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  clickableTitle: {
    minWidth: '60%',
  },
});

export default NutritionTracking;
