// React imports
import React from 'react';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  headingStyles,
} from '@styles/Main';
//Services
import {useSystem} from '@context/SystemContext';
// Components
import ClickableTile from '@components/buttons/ClickableTile';
import {ScreenProps} from '@screens/Types';
import {TileData} from '@components/buttons/ClickableTile';
import {View, StyleSheet, ScrollView, Text} from 'react-native';

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
    <View
      style={[styles.mainContainer, {backgroundColor: currentTheme.background}]}
      testID="wellness-progress-screen">
      <View style={styles.header}>
        <Text
          style={[headingStyles.headingPrimary, {color: currentTheme.text}]}>
          Health & Wellness
        </Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scroll}>
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

export default WellnessProgressScreen;
