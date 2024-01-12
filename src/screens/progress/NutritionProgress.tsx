// React imports
import React from 'react';
// Styling
import {lightThemeColors, darkThemeColors} from '@styles/main';
import {useSystem} from '@context/SystemContext';
// Types
import {TileData} from '@components/buttons/ClickableTile';
import {ScreenProps} from '@screens/types';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import Header from '@components/navbar/Header';
import {View, StyleSheet, ScrollView} from 'react-native';

const tile_data: TileData[] = [
  {
    label: 'Water',
    route: 'WaterProgress',
    icon: 'glass-water-droplet',
  },
];

const NutritionProgressScreen: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View
      style={[styles.wrapper, {backgroundColor: currentTheme.background}]}
      testID="nutrition-progress-screen">
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
              onPress={() => navigation.navigate(tile.route as 'WaterProgress')}
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
});

export default NutritionProgressScreen;
