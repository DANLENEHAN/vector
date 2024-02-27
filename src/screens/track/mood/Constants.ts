//Typing
import {MoodsDictionary} from '@screens/track/mood/Types';
import {MoodValue} from '@services/api/swagger/data-contracts';

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

export {moods};
