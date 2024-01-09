// React imports
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
// Layouts
import ScreenWrapper from '../../components/layout/ScreenWrapper';
// Styling
import {lightThemeColors, darkThemeColors} from '../../styles/main';
//Services
import {useSystem} from '../../context/SystemContext';
// Components
import ClickableTile from '../../components/buttons/ClickableTile';
import Header from '../../components/navbar/Header';
import {ScreenProps} from '../types';
import {TileData} from '../../components/buttons/ClickableTile';

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

const WellnessProgressScreen: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useSystem();
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
        <View style={styles.content} testID="wellness-progress-screen">
          {tile_data.map((tile, index) => (
            <ClickableTile
              key={index}
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

export default WellnessProgressScreen;
