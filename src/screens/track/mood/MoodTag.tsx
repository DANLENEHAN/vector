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
import {MoodTagGroups} from '@screens/track/mood/Types';
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
//Services
import {v4 as uuidv4} from 'uuid';
import {createNewMoodTagLink} from '@services/api/blueprints/moodTagLink/Functions';
import {createNewMood} from '@services/api/blueprints/mood/Functions';
import {MoodValue} from '@services/api/swagger/data-contracts';
import {transformsInternalNameToDisplay} from '@shared/Functions';
import {utcTimestampNow} from '@services/date/Functions';
import {DateFormat} from '@shared/Enums';
import moment from 'moment-timezone';

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

  // Get the mood and tags from the route params
  const mood = route.params.mood as Mood;
  const moodTags = route.params.moodTags as MoodTagGroups;

  // Get the current date
  const now = utcTimestampNow();
  const currentDatetime = moment(now).format(DateFormat.DOW_DD_MM);

  // State for the note popup
  const [notePopupVisible, setNotePopupVisible] = useState(false);
  const [note, setNote] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State for the mood tags
  const [selectedMoodTags, setMoodTags] = useState<{[key: string]: string[]}>(
    {},
  );

  /**
   * Function to select a tag
   * @param category <string> The category of the tag
   * @param tag_id <string> The id of the tag
   */
  const selectTag = (category: string, tag_id: string) => {
    setMoodTags(prev => ({
      ...prev,
      [category]: prev[category]
        ? prev[category].includes(tag_id)
          ? prev[category].filter((l: string) => l !== tag_id)
          : [...prev[category], tag_id]
        : [tag_id],
    }));
  };

  /**
   * Function to toggle the note popup
   */
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  /**
   * Function to change the note popup visibility
   */
  const changeNotePopupVisibility = () => {
    setNotePopupVisible(!notePopupVisible);
  };

  /**
   * Function to save the mood
   */
  const saveMood = async () => {
    const moodId = uuidv4();
    createNewMood({
      mood_id: moodId,
      value: mood.value,
      callback: () => saveMoodTagLinks(moodId),
      note: note !== '' ? note : undefined,
      label: mood.label as MoodValue,
    });
  };

  /**
   * Function to save the mood tag links
   * @param mood_id <string> The id of the mood
   */
  const saveMoodTagLinks = (mood_id: string) => {
    const selectedMoodTagsArray = Object.values(selectedMoodTags).flat();
    if (selectedMoodTagsArray.length === 0) {
      // If no tags are selected, navigate to the wellness tracking screen
      navigation.navigate('WellnessTracking');
      return;
    }
    createNewMoodTagLink({
      mood_id: mood_id,
      mood_tag_ids: Object.values(selectedMoodTags).flat(),
      callback: () => navigation.navigate('WellnessTracking'),
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
            Object.entries(moodTags).map(([category, tags]) => (
              <TagSelector
                tags={tags}
                tagSelectorLabel={transformsInternalNameToDisplay(category)}
                style={styles.tagSelectors}
                key={category}
                selectedTags={selectedMoodTags[category] || []}
                onTagSelect={(tag_id: string) => selectTag(category, tag_id)}
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
