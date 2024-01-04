import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Components
import HeaderBackButton from '../../components/buttons/HeaderBackButton';
import ButtonComponent from '../../components/buttons/ButtonComponent';

// Types
import {ScreenProps} from '../types';
import {StatType} from '../../services/api/swagger/data-contracts';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {margins, fontSizes, fonts, fontWeights} from '../../styles/main';

// Services
import {createNewStat} from '../../services/api/blueprints/stat/functions';

type Mood = {
  label: string;
  icon: string;
  color: string;
};

type MoodsDictionary = {
  [key: number]: Mood;
};

const moods: MoodsDictionary = {
  0: {label: 'Awful', icon: 'sad-cry', color: '#FF4D4D'},
  1: {label: 'Very Bad', icon: 'frown', color: '#FF8C4B'},
  2: {label: 'Bad', icon: 'meh', color: '#FFC542'},
  3: {label: 'Okay', icon: 'meh-blank', color: '#FFEB47'},
  4: {label: 'Good', icon: 'smile', color: '#8CE25F'},
  5: {label: 'Very Good', icon: 'grin', color: '#5EDC4E'},
  6: {label: 'Amazing', icon: 'laugh', color: '#4EDC5E'},
};

const MoodScreen: React.FC<ScreenProps> = ({navigation}) => {
  const [moodValue, setMoodValue] = useState<number>(3);

  const {theme} = useTheme();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleSliderChange = (newValue: number) => {
    setMoodValue(newValue);
  };

  const handleSaveMood = async () => {
    createNewStat(moodValue, navigation, StatType.Feeling, 'out_of_10');
  };

  const mood = moods[moodValue];

  return (
    <View style={[styles.page, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <HeaderBackButton navigation={navigation} />
      </View>
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
    </View>
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
