// Typing
import {MoodTagCreateSchema} from '@services/api/swagger/data-contracts';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';

export const getMoodTags = async (): Promise<MoodTagCreateSchema[]> => {
  const query = {
    sqlStatement: 'SELECT * FROM mood_tag;',
    params: [],
  };
  const result = await executeSqlBatch([query]);
  // Ensure that the result is not empty
  if (result[0].result.length === 0) {
    throw new Error('No mood tags found.');
  }
  const moodTags = result[0].result;
  return moodTags as MoodTagCreateSchema[];
};
