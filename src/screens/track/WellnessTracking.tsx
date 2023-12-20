// React imports
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {useTheme} from '../../context/ThemeContext';
// Components
import ClickableTile from '../../components/buttons/ClickableTile';
import Header from '../../components/navbar/Header';
// Types
import {ScreenProps} from '../types';

type TileData = {
  label: string;
  icon: string;
  backgroundColor?: string;
  lastTracked?: string;
};

const tile_data: TileData[] = [
  {
    label: 'Sleep',
    icon: 'bed',
    lastTracked: '8 hours ago',
    backgroundColor: '#F5A623',
  },
  {
    label: 'Weight',
    icon: 'weight-scale',
  },
  {
    label: 'Mood',
    icon: 'face-smile',
  },
];

const WellnessTracking: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <ScreenWrapper>
      <Header
        label="Health & Wellness"
        navigation={navigation}
        includeBackArrow={false}
        includeTopMargin={false}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {tile_data.map((tile, index) => (
            <ClickableTile
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
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
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

export default WellnessTracking;
