// Typing
import {MoodTagCreateSchema} from '@services/api/swagger/data-contracts';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';

/**
 * Function to get all mood tags from the database.
 *
 * @returns {Promise<MoodTagCreateSchema[]>} A promise that resolves to an array of mood tags.
 * @throws {Error} Throws an error if there's a problem executing the SQL queries.
 * @throws {Error} Throws an error if no mood tags are found.
 */
export const getMoodTags = async (): Promise<MoodTagCreateSchema[]> => {
  const query = {
    sqlStatement: 'SELECT * FROM mood_tag;',
    params: [],
  };
  const result = await executeSqlBatch<MoodTagCreateSchema>([query]);
  // Ensure that the result is not empty
  if (result[0].result.length === 0) {
    throw new Error('No mood tags found.');
  }
  const moodTags = result[0].result;
  return moodTags as MoodTagCreateSchema[];
};
