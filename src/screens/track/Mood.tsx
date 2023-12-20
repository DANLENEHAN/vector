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

const moodOptions = [
  'Awful',
  'Very Bad',
  'Bad',
  'Okay',
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
      '#FF4D4D', // Awful
      '#FF8C4B', // Very Bad
      '#FFC542', // Bad
      '#FFEB47', // Okay
      '#8CE25F', // Good
      '#5EDC4E', // Very Good
      '#4EDC5E', // Amazing
    ];

    // Ensure the value is within bounds
    const index = Math.min(Math.max(0, Math.round(value)), colorMap.length - 1);

    return colorMap[index];
  };

  const handleSliderChange = (newValue: number) => {
    setMoodValue(newValue);
  };

  const handleSaveMood = async () => {
    const user = await getUserDetails();
    createStat({
      unit: 'out_of_10', // NOTE: Should probaly change to reflect the moodOptions array
      stat_type: StatType.Feeling,
      user_id: user.user_id,
      value: moodValue,
    });
    navigation.goBack();
  };

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
              marginBottom: margins.large,
              color: currentTheme.text,
            },
          ]}>
          Express your mood in a word...
        </Text>
        <View style={styles.iconContainer}>
          <Icon
            name="heart"
            solid
            size={300}
            color={calculateHeartColor(moodValue)}
          />
          <Text style={styles.overlayText}>{moodOptions[moodValue]}</Text>
        </View>
        <Slider
          style={[styles.slider, {marginBottom: margins.xxxLarge}]}
          value={moodValue}
          onValueChange={handleSliderChange}
          step={1}
          minimumValue={0}
          maximumValue={moodOptions.length - 1}
          thumbTintColor={calculateHeartColor(moodValue)}
          minimumTrackTintColor="#D3D3D3"
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
    textAlign: 'center', // Center the text horizontally
    textAlignVertical: 'center', // Center the text vertically
    maxWidth: 275,
  },
  slider: {
    width: 300,
    height: 40,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    position: 'absolute',
    color: 'white',
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.primary,
    fontWeight: fontWeights.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});

export default MoodScreen;
