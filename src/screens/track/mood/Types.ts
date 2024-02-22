import {MoodTagCategory} from '@services/api/swagger/data-contracts';
import {TagProps} from '@components/inputs/TagSelector';

/**
 * Interface for the mood object
 *
 * @interface Mood
 *
 * @param {string} label - The label for the mood
 * @param {string} icon - The icon for the mood
 * @param {string} color - The color for the mood
 */
export interface Mood {
  label: string;
  icon: string;
  color: string;
  value: number;
}

/**
 * Interface for the mood dictionary
 *
 * @interface MoodsDictionary
 *
 * @param {number} key - The key for the mood
 * @param {Mood} value - The value for the mood
 */
export interface MoodsDictionary {
  [key: number]: Mood;
}

export type MoodTagGroups = Partial<Record<MoodTagCategory, TagProps[]>>;
