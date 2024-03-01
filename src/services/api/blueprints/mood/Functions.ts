// Functions
import {getUser} from '@services/db/user/Functions';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuid4} from 'uuid';
import {getMoods} from '@services/db/mood/Functions';
import {generateGraphData} from '@services/timeSeries/Functions';

// Types
import {MoodValue} from '@services/api/swagger/data-contracts';
import {insertMoods} from '@services/db/mood/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';
import {graphPeriodData} from '@services/timeSeries/Types';
import {syncDbTables} from '@shared/Constants';
import {UserCreateSchema} from '@services/api/swagger/data-contracts';

// Logger
import logger from '@utils/Logger';
import moment from 'moment';

/**
 * Interface for the CreateNewMoodParams function.
 *
 * @param value  The value of the mood.
 * @param callback  The callback function to be called after the mood is created.
 * @param note  The note of the mood (optional).
 * @param label  The label of the mood.
 * @param mood_id  The id of the mood (optional).
 */
export interface CreateNewMoodParams {
  value: number;
  callback: () => void;
  note?: string;
  label: MoodValue;
  mood_id?: string;
}

/**
 * @description Create a new Mood.
 *
 * @param {Object} CreateNewMoodParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the mood is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const createNewMood = async ({
  value,
  mood_id,
  callback,
  label,
  note,
}: CreateNewMoodParams): Promise<void> => {
  try {
    const user: UserCreateSchema | null = await getUser();
    if (user != null) {
      const timestampTimezone: TimestampTimezone =
        getCurrentTimestampTimezone();
      const moodId = mood_id ? mood_id : uuid4();
      await insertMoods([
        {
          mood_id: moodId,
          user_id: user.user_id,
          value: value,
          label: label,
          note: note,
          [timestampFields.createdAt]: timestampTimezone.timestamp,
          [timestampFields.timezone]: timestampTimezone.timezone,
        },
      ]);
      callback();
    } else {
      logger.warn('Unable to retreive user will not insert mood get stats.');
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

/**
 * Function to get the mood data.
 * @returns {Promise<graphPeriodData>} A promise that resolves to an object containing the mood data.
 * @throws {Error} Throws an error if there's a problem executing the SQL queries.
 */
export const getMoodData = async (): Promise<graphPeriodData> => {
  const user: UserCreateSchema | null = await getUser();
  if (user != null) {
    // Get all moods for the user that are not deleted
    const moods = await getMoods({
      columns: ['value', 'created_at'],
      whereClause: `user_id = '${user.user_id}' AND deleted IS false`,
    });
    return generateGraphData({
      table: syncDbTables.moodTable,
      data: moods,
      targetDate: moment.utc(),
    });
  } else {
    throw new Error('Unable to retreive user will not insert mood get stats.');
  }
};
