import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Components
import Header from '../../components/navbar/Header';
import ButtonComponent from '../../components/buttons/ButtonComponent';

// Types
import {ScreenProps} from '../types';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {margins, fontSizes, fonts, fontWeights} from '../../styles/main';

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
  const [moodValue, setMoodValue] = useState<number>(3);

  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const calculateHeartColor = (value: number) => {
    const colorMap = [
      '#FF0000',
      '#FF4500',
      '#FF8C00',
      '#FFFF00',
      '#ADFF2F',
      '#32CD32',
      '#008000',
    ];

    // Ensure the value is within bounds
    const index = Math.min(Math.max(0, Math.round(value)), colorMap.length - 1);

    return colorMap[index];
  };

  const handleSliderChange = (newValue: number) => {
    setMoodValue(newValue);
  };

  const handleSaveMood = () => {
    // Implement your logic for saving the mood
  };

  return (
    <View style={[styles.page, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <Header
          label="Mindful Moments"
          navigation={navigation}
          includeBackArrow={true}
          includeTopMargin={true}
        />
      </View>
      <View style={styles.contentSection}>
        <Text style={[styles.title, {marginBottom: margins.xxLarge}]}>
          What word captures your current emotion?
        </Text>
        <TouchableOpacity
          onPress={() => console.log('Pressed Heart')}
          style={styles.iconContainer}>
          <Icon
            name="heart"
            solid
            size={300}
            color={calculateHeartColor(moodValue)}
          />
          <Text style={styles.overlayText}>{moodOptions[moodValue]}</Text>
        </TouchableOpacity>
        <Slider
          style={[{width: 300}, {marginBottom: margins.xxLarge}]}
          value={moodValue}
          onValueChange={handleSliderChange}
          step={1}
          minimumValue={0}
          maximumValue={moodOptions.length - 1}
        />
        <ButtonComponent
          text="Capture Mood"
          disabled={false}
          onPress={handleSaveMood}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
    textAlign: 'center', // Center the text horizontally
    textAlignVertical: 'center', // Center the text vertically
    marginBottom: margins.xxLarge,
    maxWidth: 275,
  },

  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    position: 'absolute',
    color: 'black',
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
  },
});

export default MoodScreen;
