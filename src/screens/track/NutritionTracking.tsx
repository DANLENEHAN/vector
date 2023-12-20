// React imports
import React from 'react';
import {View, StyleSheet} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  margins,
  fontSizes,
  fontWeights,
  fonts,
} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
// Components
import ClickableTile from '../../components/buttons/ClickableTile';
// Types
import {ScreenProps} from '../types';

const tile_data = [
  {
    label: 'Calorie & Macros',
    icon: 'utensils',
    lastTracked: '8 hours ago',
    backgroundColor: '#F5A623',
  },
  {
    label: 'Water',
    icon: 'glass-water-droplet',
  },
];

const NutritionTracking: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <ScreenWrapper>
      <View style={styles.content}>
        {tile_data.map((tile, index) => (
          <ClickableTile
            style={[{marginBottom: margins.xLarge}, styles.clickableTitle]}
            key={index}
            onPress={() =>
              navigation.navigate(tile.label as 'Sleep' | 'Weight' | 'Mood')
            }
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

export default NutritionTracking;
