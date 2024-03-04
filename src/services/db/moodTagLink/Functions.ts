// Typing
import {MoodTagLinkCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Operations';

/**
 * @description Inserts an array of mood tag links into the mood tag link table.
 *
 * @param moodTagLinks An array of MoodTagLinkCreateSchema objects representing the mood tag links to be inserted.
 * @returns {Promise<void>} A promise that resolves when the mood tag links are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const insertMoodTagLinks = async (
  moodTagLinks: MoodTagLinkCreateSchema[],
): Promise<void> => {
  await insertRows<MoodTagLinkCreateSchema>(
    syncDbTables.moodTagLinkTable,
    moodTagLinks,
  );
};
