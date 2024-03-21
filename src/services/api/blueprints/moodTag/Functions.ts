// Functions
import {getMoodTags} from '@services/db/moodTag/Functions';
// Logger
import logger from '@utils/Logger';
import {MoodTagGroups} from '@screens/track/mood/Types';
import {MoodTagCategory} from '@services/api/swagger/data-contracts';
import {TagProps} from '@components/inputs/TagSelector';

/**
 * Function to get the mood tags from the database
 * and parse them into the expected format for the mood tag selector
 * @returns  {Promise<MoodTagGroups | undefined>} - Returns the mood tags in the expected format
 */
export const getMoodTagObject = async (): Promise<
  MoodTagGroups | undefined
> => {
  try {
    const moodTags = await getMoodTags();
    const output: MoodTagGroups = {};

    moodTags.forEach(moodTag => {
      const category = moodTag.category as MoodTagCategory;
      const tag: TagProps = {
        label: moodTag.label,
        icon: moodTag.icon,
        color: undefined,
      };

      if (!output[category]) {
        output[category] = [];
      }

      output[category]!.push(tag);
    });

    logger.info('Mood tags retrieved successfully.');
    return output;
  } catch (error) {
    logger.error(`Error: ${error}`);
    return undefined;
  }
};
