// React imports
import React, {useState} from 'react';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';
import Header from '@components/navbar/Header';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Types
import {ScreenProps} from '@screens/types';
import {StatType} from '@services/api/swagger/data-contracts';
// Styling
import {useSystem} from '@context/SystemContext';
import {lightThemeColors, darkThemeColors} from '@styles/main';
import {margins, fontSizes, fonts, fontWeights} from '@styles/main';
// Services
import {createNewStat} from '@services/api/blueprints/stat/functions';

/**
 * Interface for the mood object
 *
 * @interface Mood
 *
 * @param {string} label - The label for the mood
 * @param {string} icon - The icon for the mood
 * @param {string} color - The color for the mood
 */
interface Mood {
  label: string;
  icon: string;
  color: string;
}

/**
 * Interface for the mood dictionary
 *
 * @interface MoodsDictionary
 *
 * @param {number} key - The key for the mood
 * @param {Mood} value - The value for the mood
 */
interface MoodsDictionary {
  [key: number]: Mood;
}

// Dictionary for the moods
const moods: MoodsDictionary = {
  0: {label: 'Awful', icon: 'sad-cry', color: '#FF4D4D'},
  1: {label: 'Very Bad', icon: 'frown', color: '#FF8C4B'},
  2: {label: 'Bad', icon: 'meh', color: '#FFC542'},
  3: {label: 'Okay', icon: 'meh-blank', color: '#FFEB47'},
  4: {label: 'Good', icon: 'smile', color: '#8CE25F'},
  5: {label: 'Very Good', icon: 'grin', color: '#5EDC4E'},
  6: {label: 'Amazing', icon: 'laugh', color: '#4EDC5E'},
};

/**
 *  Mood tracking screen
 *
 * @component MoodScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the mood tracking screen component
 *
 * @example
 * <MoodScreen navigation={navigation}/>
 */
const MoodScreen: React.FC<ScreenProps> = ({navigation}) => {
  const [moodValue, setMoodValue] = useState<number>(3);

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleSliderChange = (newValue: number) => {
    setMoodValue(newValue);
  };

  const handleSaveMood = async () => {
    createNewStat({
      value: moodValue,
      unitValue: 'out_of_10',
      navigation: navigation,
      statType: StatType.Feeling,
    });
  };

  const mood = moods[moodValue];

  return (
    <ScreenWrapper>
      <Header
        label=""
        navigation={navigation}
        includeBackArrow={true}
        includeTopMargin={true}
      />
      <View style={styles.contentSection}>
        <Text style={[styles.title, {color: currentTheme.text}]}>
          What's your mood?
        </Text>
        <Icon
          style={styles.moodIcon}
          name={mood.icon}
          solid
          size={300}
          color={mood.color}
        />
        <Text
          style={[
            {color: currentTheme.text, shadowColor: currentTheme.shadow},
            styles.moodText,
          ]}>
          {mood.label}
        </Text>
        <Slider
          style={styles.slider}
          value={moodValue}
          onValueChange={handleSliderChange}
          step={1}
          minimumValue={0}
          maximumValue={Object.keys(moods).length - 1}
          thumbTintColor={mood.color}
          maximumTrackTintColor={currentTheme.icon}
          minimumTrackTintColor={currentTheme.icon}
        />
        <ButtonComponent
          text="Capture"
          disabled={false}
          onPress={handleSaveMood}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  headerSection: {
    flex: 1,
    marginTop: margins.large,
  },
  contentSection: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: margins.xxLarge,
  },
  slider: {
    width: 300,
    height: 40,
    marginBottom: margins.xxLarge,
  },
  moodText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
  },
  moodIcon: {
    marginBottom: margins.xxLarge,
  },
});

export default MoodScreen;
