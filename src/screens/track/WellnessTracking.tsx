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

const tile_data: TileData[] = [
  {
    label: 'Weight',
    icon: 'weight-scale',
    route: 'WeightTracking',
  },
  {
    label: 'Mood',
    icon: 'face-smile',
    route: 'MoodTracking',
  },
];

const WellnessTracking: React.FC<ScreenProps> = ({navigation}) => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View style={[styles.wrapper, {backgroundColor: currentTheme.background}]}>
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
                navigation.navigate(
                  tile.route as 'WeightTracking' | 'MoodTracking',
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

export default WellnessTracking;
