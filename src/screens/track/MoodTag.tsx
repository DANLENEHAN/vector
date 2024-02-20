// React imports
import React from 'react';
// Components
import Header from '@components/navbar/Header';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Types
import {ScreenProps} from '@screens/Types';
// Styling
import {useSystem} from '@context/SystemContext';
import {lightThemeColors, darkThemeColors} from '@styles/Main';
import {marginSizes, layoutStyles, headingTextStyles} from '@styles/Main';

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
 *  Mood tag tracking screen
 *
 * @component MoodTagScreen
 * @param {ScreenProps} navigation - Navigation object for the screen
 *
 * @returns {React.FC} - Returns the mood tracking screen component
 */
const MoodTagScreen: React.FC<any> = ({
  navigation,
  route,
}: any): React.ReactElement<ScreenProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  const mood = route.params.mood as Mood;

  return (
    <ScreenWrapper>
      <View style={styles.headerSection}>
        <Header navigation={navigation} includeBackArrow={true} />
      </View>
      <View style={styles.content}>
        <View style={styles.currentMood}>
          <Icon name={mood.icon} solid size={100} color={mood.color} />
          <Text
            style={[
              styles.emotionLabel,
              {color: currentTheme.text, shadowColor: currentTheme.shadow},
            ]}>
            {mood.label}
          </Text>
        </View>
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
    ...layoutStyles.flexStartVertical,
  },
  title: {
    ...headingTextStyles.medium,
    marginBottom: marginSizes.xxLarge,
  },
  emotionLabel: {
    ...headingTextStyles.small,
    marginTop: marginSizes.small,
  },
  currentMood: {
    ...layoutStyles.centerVertically,
  },
});

export default MoodTagScreen;
