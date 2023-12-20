import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Components
import HeaderBackButton from '../../components/buttons/HeaderBackButton';
import ButtonComponent from '../../components/buttons/ButtonComponent';

// Types
import {ScreenProps} from '../types';
import {StatType} from '../../services/api/stat/types';

// Styling
import {useTheme} from '../../context/ThemeContext';
import {lightThemeColors, darkThemeColors} from '../../styles/main';
import {margins, fontSizes, fonts, fontWeights} from '../../styles/main';

// Services
import {createStat} from '../../services/api/stat/functions';
import {getUserDetails} from '../../services/api/user/functions';

interface Mood {
  label: string;
  icon: string;
  color: string;
}

interface MoodsDictionary {
  [key: number]: Mood;
}

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
    try {
      const user = await getUserDetails();
      await createStat({
        unit: 'out_of_10',
        stat_type: StatType.Feeling,
        user_id: user.user_id,
        value: moodValue,
      });
      navigation.goBack();
    } catch (error) {
      console.log("Couldn't save mood", error);
    }
  };

  const mood = moods[moodValue];

  return (
    <View style={[styles.page, {backgroundColor: currentTheme.background}]}>
      <View style={styles.headerSection}>
        <HeaderBackButton navigation={navigation} />
      </View>
      <View style={styles.contentSection}>
        <Text
          style={[
            styles.title,
            {
              marginBottom: margins.xxLarge,
              color: currentTheme.text,
            },
          ]}>
          What's your mood?
        </Text>
        <Icon
          style={{marginBottom: margins.xxLarge}}
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
          style={[styles.slider, {marginBottom: margins.xxLarge}]}
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
  },
  slider: {
    width: 300,
    height: 40,
  },
  moodText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
  },
});

export default MoodScreen;