import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

// Layouts
import Header from '../../components/navbar/Header';

// Types
import {ScreenProps} from '../types';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {lightThemeColors, darkThemeColors} from '../../styles/main';

const moodOptions = [
  'Awful',
  'Very Bad',
  'Bad',
  'Ok',
  'Good',
  'Very Good',
  'Amazing',
];

const MoodScreen: React.FC<ScreenProps> = ({navigation}) => {
  const [moodValue, setMoodValue] = useState<number>(3); // Default to 'Ok'

  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleSliderChange = (newValue: number) => {
    setMoodValue(newValue);
  };

  return (
    <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <Header
          label="Mood"
          navigation={navigation}
          includeBackArrow={true}
          includeTopMargin={true}
        />
      </View>
      <View style={styles.settingsSection}>
        <View style={styles.sliderContainer}>
          <Text>Mood</Text>
          <Slider
            value={moodValue}
            onValueChange={handleSliderChange}
            step={1}
            minimumValue={0}
            maximumValue={moodOptions.length - 1}
          />
          <Text>Selected Mood: {moodOptions[moodValue]}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default MoodScreen;
