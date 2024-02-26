// React imports
import React, {useState, useEffect} from 'react';
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
import {layoutStyles, headingTextStyles} from '@styles/Main';
// Constants
import {moods} from '@screens/track/mood/Constants';
import {MoodTagGroups} from '@screens/track/mood/Types';
import {getMoodTagObject} from '@services/api/blueprints/moodTag/Functions';
// Logger
import logger from '@utils/Logger';

/**
 *  Mood tracking screen
 *
 * @component MoodScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the mood tracking screen component
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

  const [fetchedMoodTags, setFetchedMoodTags] = useState<MoodTagGroups>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchMoodTags = async () => {
      try {
        const moodTags = await getMoodTagObject();
        if (!moodTags) {
          logger.error('Failed to fetch mood tags');
          return;
        }
        // Assuming getMoodTagObject returns the data in the structure { category: [{ tag_id, label, icon, color }], ... }
        setFetchedMoodTags(moodTags);
      } catch (error) {
        logger.error('Failed to fetch mood tags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoodTags();
  }, []);

  const mood = moods[moodValue];

  return (
    <ScreenWrapper>
      <View style={styles.headerSection}>
        <Header onClick={navigation.goBack} includeBackArrow={true} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={[styles.title, {color: currentTheme.text}]}>
            What's your mood?
          </Text>
          <Icon name={mood.icon} solid size={150} color={mood.color} />
          <Text
            style={[
              styles.emotionLabel,
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
            disabled={isLoading}
            onPress={() =>
              navigation.navigate('MoodTagTracking', {
                mood: moods[moodValue],
                moodTags: fetchedMoodTags,
              })
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flex: 1,
  },
  contentContainer: {
    flex: 15,
    ...layoutStyles.centerVertically,
  },
  content: {
    height: '60%',
    width: '80%',
    ...layoutStyles.spaceBetweenVertical,
  },
  title: {
    ...headingTextStyles.small,
    textAlign: 'center',
  },
  emotionLabel: {
    ...headingTextStyles.xSmall,
  },
  slider: {
    width: 300,
  },
});

export default MoodScreen;
