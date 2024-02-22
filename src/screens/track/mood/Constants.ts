//Typing
import {MoodTagGroups, MoodsDictionary} from '@screens/track/mood/Types';
import {MoodTagCategory, MoodValue} from '@services/api/swagger/data-contracts';

/**
 * Mood tag groups
 *
 * The mood tag groups are used to group the mood tags into categories.
 **/
const moodTagGroups: MoodTagGroups = {
  [MoodTagCategory.Social]: [
    {
      label: 'Met Friends',
      icon: 'people-group',
      color: 'blue',
    },
    {
      label: 'Family Time',
      icon: 'children',
      color: 'green',
    },
    {
      label: 'Date Night',
      icon: 'heart',
      color: 'red',
    },
    {
      label: 'Alone Time',
      icon: 'user',
      color: 'blue',
    },
  ],
  [MoodTagCategory.Emotions]: [
    {
      label: 'Happy',
      icon: 'smile',
      color: 'green',
    },
    {
      label: 'Sad',
      icon: 'sad-cry',
      color: 'red',
    },
    {
      label: 'Angry',
      icon: 'angry',
      color: 'red',
    },
    {
      label: 'Excited',
      icon: 'laugh',
      color: 'blue',
    },
    {
      label: 'Anxious',
      icon: 'exclamation',
      color: 'red',
    },
  ],
  [MoodTagCategory.BadHabits]: [
    {
      label: 'Smoking',
      icon: 'smoking',
      color: 'red',
    },
    {
      label: 'Drinking',
      icon: 'glass-whiskey',
      color: 'red',
    },
    {
      label: 'Drugs',
      icon: 'syringe',
      color: 'red',
    },
    {
      label: 'Overeating',
      icon: 'utensils',
      color: 'red',
    },
  ],
};

/**
 * Moods
 *
 * The moods are used to represent the different mood values.
 */
const moods: MoodsDictionary = {
  0: {
    label: MoodValue.Awful,
    icon: 'sad-cry',
    color: '#FF4D4D',
    value: 0,
  },
  1: {
    label: MoodValue.VeryBad,
    icon: 'frown',
    color: '#FF8C4B',
    value: 1,
  },
  2: {
    label: MoodValue.Bad,
    icon: 'meh',
    color: '#FFC542',
    value: 2,
  },
  3: {
    label: MoodValue.Neutral,
    icon: 'meh-blank',
    color: '#FFEB47',
    value: 3,
  },
  4: {
    label: MoodValue.Good,
    icon: 'smile',
    color: '#8CE25F',
    value: 4,
  },
  5: {
    label: MoodValue.VeryGood,
    icon: 'grin',
    color: '#5EDC4E',
    value: 5,
  },
  6: {
    label: MoodValue.Amazing,
    icon: 'laugh',
    color: '#4EDC5E',
    value: 6,
  },
};

export {moodTagGroups, moods};
