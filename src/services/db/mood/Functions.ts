// Typing
import {MoodCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Operations';

/**
 * @description Inserts an array of moods into the mood table.
 *
 * @param moods An array of MoodCreateSchema objects representing the moods to be inserted.
 * @returns {Promise<void>} A promise that resolves when the moods are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const insertMoods = async (moods: MoodCreateSchema[]): Promise<void> => {
  await insertRows(syncDbTables.moodTable, moods);
};
