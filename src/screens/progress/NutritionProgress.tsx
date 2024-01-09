// React imports
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  fontSizes,
  lightThemeColors,
  darkThemeColors,
  fonts,
  fontWeights,
  margins,
} from '../../styles/main';
//Services
import {useSystem} from '../../context/SystemContext';
// Types
import {TileData} from '../../components/buttons/ClickableTile';
import {ScreenProps} from '../types';
// Components
import ClickableTile from '../../components/buttons/ClickableTile';

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
    <ScreenWrapper>
      <View style={styles.content} testID="nutrition-progress-screen">
        <Text
          style={[
            styles.title,
            {
              marginBottom: margins.xxLarge,
              color: currentTheme.text,
            },
          ]}>
          Fuel your body!
        </Text>
        {tile_data.map((tile, index) => (
          <ClickableTile
            style={[{marginBottom: margins.xLarge}, styles.clickableTitle]}
            key={index}
            onPress={() => navigation.navigate(tile.route as 'WaterProgress')}
            label={tile.label}
            icon={tile.icon}
            lastTracked={tile.lastTracked}
            backgroundColor={tile.backgroundColor ?? currentTheme.primary}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  clickableTitle: {
    minWidth: '60%',
  },
});

export default NutritionProgressScreen;
