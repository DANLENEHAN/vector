// Functions
import {getUtcNowAndDeviceTimezone} from '@services/date/Functions';
import {v4 as uuidv4} from 'uuid';

// Types
import {insertMoodTagLinks} from '@services/db/moodTagLink/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';

// Logger
import logger from '@utils/Logger';

/**
 * Interface for the parameters of the createNewMoodTagLink function.
 * @interface CreateNewMoodTagLinkParams
 *
 * @property {string} mood_id The id of the mood to link the mood tag to.
 * @property {string} mood_tag_id The id of the mood tag to link to the mood.
 * @property {() => void} callback The callback function to call after the mood tag link is created.
 */
export interface CreateNewMoodTagLinkParams {
  mood_id: string;
  mood_tag_ids: string[];
  callback: () => void;
}

/**
 * @description Create a new Mood Tag Link.
 *
 * @param {Object} CreateNewMoodTagLinkParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the mood tag link is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const createNewMoodTagLink = async ({
  callback,
  mood_id,
  mood_tag_ids,
}: CreateNewMoodTagLinkParams): Promise<void> => {
  try {
    const timestampTimezone: TimestampTimezone = getUtcNowAndDeviceTimezone();
    const mood_tag_links = mood_tag_ids.map(mood_tag_id => ({
      mood_id: mood_id,
      mood_tag_id: mood_tag_id,
      mood_tag_link_id: uuidv4(),
      [timestampFields.createdAt]: timestampTimezone.timestamp,
      [timestampFields.timezone]: timestampTimezone.timezone,
    }));
    await insertMoodTagLinks(mood_tag_links);
    callback();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};
