// React imports
import React from 'react';
import {Text} from 'react-native';
// Styling
import {
  lightThemeColors,
  darkThemeColors,
  layoutStyles,
  titleStyles,
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

/**
 * Home screen for the wellness tracking section
 *
 * @param {ScreenProps} props - Navigation object for the screen
 * @returns {React.FC} - Returns the wellness tracking screen component
 *
 * @example
 * <WellnessTracking navigation={navigation}/>
 */
const WellnessTracking: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
    <View
      style={[styles.mainContainer, {backgroundColor: currentTheme.background}]}
      testID="wellness-tracking-screen">
      <View style={styles.header}>
        <Text style={[titleStyles.headingPrimary, {color: currentTheme.text}]}>
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

export default WellnessTracking;
