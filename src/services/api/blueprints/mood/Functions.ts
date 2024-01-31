// Functions
import {getUserDetails} from '@services/asyncStorage/Functions';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuidv4} from 'uuid';

// Types
import {MoodValue} from '@services/api/swagger/data-contracts';
import {insertMoods} from '@services/db/mood/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';

// Logger
import logger from '@utils/Logger';

/**
 * Interface for the CreateNewMoodParams function.
 *
 * @param value  The value of the mood.
 * @param navigation  The navigation object.
 * @param note  The note of the mood (optional).
 * @param label  The label of the mood.
 */
export interface CreateNewMoodParams {
  value: number;
  navigation: any;
  note?: string;
  label: MoodValue;
}

/**
 * @description Create a new Mood.
 *
 * @param {Object} CreateNewMoodParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the mood is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 */
export const createNewMood = async ({
  value,
  navigation,
  label,
  note,
}: CreateNewMoodParams): Promise<void> => {
  try {
    const user_id = await getUserDetails('user_id');
    const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

    await insertMoods([
      {
        mood_id: uuidv4(),
        user_id: user_id,
        value: value,
        label: label,
        note: note,
        [timestampFields.createdAt]: timestampTimezone.timestamp,
        [timestampFields.timezone]: timestampTimezone.timezone,
      },
    ]);
    navigation.goBack();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};
