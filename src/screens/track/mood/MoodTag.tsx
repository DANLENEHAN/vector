// React imports
import React, {useState} from 'react';
// Components
import Header from '@components/navbar/Header';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import TagSelector from '@components/inputs/TagSelector';
import NotePopup from '@components/popups/NotePopup';
import ButtonComponent from '@components/buttons/ButtonComponent';
// Types
import {ScreenProps} from '@screens/Types';
import {Mood} from '@screens/track/mood/Types';
// Styling
import {useSystem} from '@context/SystemContext';
import {
  lightThemeColors,
  darkThemeColors,
  borderRadius,
  borderWidth,
  iconSizes,
  marginSizes,
  layoutStyles,
  headingTextStyles,
  paddingSizes,
  bodyTextStyles,
} from '@styles/Main';
// Constants
import {moodTagGroups} from '@screens/track/mood/Constants';
//Services
import {createNewMood} from '@services/api/blueprints/mood/Functions';
import {MoodValue} from '@services/api/swagger/data-contracts';
import {transformsInternalNameToDisplay} from '@shared/Functions';
import {formatDate, utcTimestampNow} from '@services/date/Functions';
import {DateFormat} from '@shared/Enums';

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
  // Get the current theme
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Get the mood from the route params
  const mood = route.params.mood as Mood;

  // Get the current date
  const now = utcTimestampNow();
  const currentDatetime = formatDate(now, DateFormat.DOW_DD_MM);

  const [notePopupVisible, setNotePopupVisible] = useState(false);
  const [note, setNote] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const changeNotePopupVisibility = () => {
    setNotePopupVisible(!notePopupVisible);
  };

  const saveMood = () => {
    createNewMood({
      value: mood.value,
      callback: () => navigation.navigate('WellnessTracking'),
      note: note !== '' ? note : undefined,
      label: mood.label as MoodValue,
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.headerSection}>
        <Header
          onClick={navigation.goBack}
          includeBackArrow={true}
          label={currentDatetime}
        />
      </View>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.currentMood}>
            <Icon name={mood.icon} solid size={50} color={mood.color} />
            <Text
              style={[
                styles.emotionLabel,
                {color: currentTheme.text, shadowColor: currentTheme.shadow},
              ]}>
              {mood.label}
            </Text>
          </View>
          {
            // For group in MoodTagGroups
            // add a TagSelector
            Object.entries(moodTagGroups).map(([category, tags]) => (
              <TagSelector
                tags={tags}
                tagSelectorLabel={transformsInternalNameToDisplay(category)}
                style={styles.tagSelectors}
                key={category}
              />
            ))
          }

          <View
            style={[
              styles.NoteContainer,
              {
                borderColor: currentTheme.borders,
                backgroundColor: currentTheme.secondaryBackground,
                ...layoutStyles.flexStartVertical,
              },
            ]}>
            <View style={styles.NoteHeader}>
              <Text style={[styles.NoteLabel, {color: currentTheme.text}]}>
                Note
              </Text>
              <View>
                <TouchableOpacity
                  onPress={toggleCollapse}
                  style={[
                    styles.NoteCollapse,
                    {
                      backgroundColor: currentTheme.button,
                    },
                  ]}
                  testID="noteCollapseButton">
                  <Icon
                    name={isCollapsed ? 'caret-down' : 'caret-up'}
                    solid
                    size={iconSizes.small}
                    color={currentTheme.background}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <NotePopup
              visible={notePopupVisible}
              message="Add a note..."
              maxLength={500}
              onClose={changeNotePopupVisibility}
              content={note}
              setContent={setNote}
            />
            {!isCollapsed && (
              <TouchableOpacity
                style={[
                  styles.NoteContent,
                  {
                    borderColor: currentTheme.borders,
                    borderRadius: borderRadius.medium,
                    borderWidth: borderWidth.small,
                    backgroundColor: currentTheme.background,
                  },
                ]}
                onPress={() => {
                  changeNotePopupVisibility();
                }}>
                <Text style={[styles.NoteText, {color: currentTheme.text}]}>
                  {note !== ''
                    ? note.length > 90
                      ? note.substring(0, 90) + '...'
                      : note
                    : 'Add a note...'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ButtonComponent
            text="Capture"
            disabled={false}
            onPress={saveMood}
            style={{marginVertical: marginSizes.small}}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  // Header
  headerSection: {
    flex: 1,
  },
  // Content
  content: {
    flex: 9,
  },
  scroll: {
    ...layoutStyles.flexStartVertical,
  },

  // Current mood styles
  emotionLabel: {
    ...headingTextStyles.xSmall,
    marginTop: marginSizes.small,
  },
  currentMood: {
    ...layoutStyles.centerVertically,
    marginVertical: marginSizes.small,
  },

  // Tag styles
  tagSelectors: {
    marginVertical: marginSizes.small,
  },

  // Note styles
  NoteHeader: {
    width: '95%',
    margin: marginSizes.xSmall,
    ...layoutStyles.spaceBetweenHorizontal,
  },
  NoteLabel: {
    ...headingTextStyles.xxSmall,
  },
  NoteCollapse: {
    borderRadius: borderRadius.circle,
    height: 25,
    width: 25,
    ...layoutStyles.centerHorizontally,
  },
  NoteContent: {
    width: '95%',
    overflow: 'hidden',
    minHeight: 100,
    maxHeight: 200,
  },
  NoteContainer: {
    width: '95%',
    borderRadius: borderRadius.large,
    borderWidth: borderWidth.xSmall,
    padding: paddingSizes.small,
    marginVertical: marginSizes.small,
  },
  NoteText: {
    textAlignVertical: 'top',
    padding: paddingSizes.xSmall,
    ...bodyTextStyles.xxSmall,
  },
});

export default MoodTagScreen;
