// React imports
import React from 'react';
// Styling
import {lightThemeColors, darkThemeColors} from '@styles/Main';
//Services
import {useSystem} from '@context/SystemContext';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import Header from '@components/navbar/Header';
import {ScreenProps} from '@screens/Types';
import {TileData} from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView} from 'react-native';

// Data
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

/**
 * Wellness Progress Screen
 *
 * @component WellnessProgressScreen
 *
 * @param {ScreenProps} navigation - Stack Navigation
 *
 * @returns {React.FC} - Wellness Progress Screen Component
 *
 * @example
 * <WellnessProgressScreen navigation={navigation}/>
 */
const WellnessProgressScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <View style={[styles.wrapper, {backgroundColor: currentTheme.background}]}>
      <Header
        label="Health & Wellness"
        navigation={navigation}
        includeBackArrow={false}
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

export default WellnessProgressScreen;
