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
import {ScreenProps} from '@screens/Types';
// Styling
import {useSystem} from '@context/SystemContext';
import {lightThemeColors, darkThemeColors} from '@styles/Main';
import {marginSizes, layoutStyles, titleStyles} from '@styles/Main';
// Services
import {createNewMood} from '@services/api/blueprints/mood/Functions';
// Constants
import {MoodValue} from '@services/api/swagger/data-contracts';

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
  0: {label: MoodValue.Awful, icon: 'sad-cry', color: '#FF4D4D'},
  1: {label: MoodValue.VeryBad, icon: 'frown', color: '#FF8C4B'},
  2: {label: MoodValue.Bad, icon: 'meh', color: '#FFC542'},
  3: {label: MoodValue.Neutral, icon: 'meh-blank', color: '#FFEB47'},
  4: {label: MoodValue.Good, icon: 'smile', color: '#8CE25F'},
  5: {label: MoodValue.VeryGood, icon: 'grin', color: '#5EDC4E'},
  6: {label: MoodValue.Amazing, icon: 'laugh', color: '#4EDC5E'},
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
const MoodScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const [moodValue, setMoodValue] = useState<number>(3);

  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleSliderChange = (newValue: number) => {
    setMoodValue(newValue);
  };

  const handleSaveMood = async () => {
    createNewMood({
      value: moodValue,
      label: moods[moodValue].label as MoodValue,
      navigation: navigation,
    });
  };

  const mood = moods[moodValue];

  return (
    <ScreenWrapper>
      <View style={styles.headerSection}>
        <Header navigation={navigation} includeBackArrow={true} />
      </View>
      <View style={styles.content}>
        <Text style={[titleStyles.titleSecondary, {color: currentTheme.text}]}>
          What's your mood?
        </Text>
        <Icon name={mood.icon} solid size={300} color={mood.color} />
        <Text
          style={[
            titleStyles.titleSecondary,
            {color: currentTheme.text, shadowColor: currentTheme.shadow},
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
  headerSection: {
    flex: 1,
  },
  content: {
    flex: 9,
    ...layoutStyles.spaceAroundVertical,
  },
  title: {
    ...titleStyles.titleSecondary,
    marginBottom: marginSizes.xxLarge,
  },
  slider: {
    width: 300,
    marginBottom: marginSizes.xxLarge,
  },
});

export default MoodScreen;
