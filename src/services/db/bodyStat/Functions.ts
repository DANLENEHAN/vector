// Typing
import {BodyStatCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Functions';

/**
 * @description Inserts an array of stats into the body_stat table.
 *
 * @param stats An array of BodyStatCreateSchema objects representing the stats to be inserted.
 * @returns {Promise<void>} A promise that resolves when the stats are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const insertStat = async (
  stats: BodyStatCreateSchema[],
): Promise<void> => {
  await insertRows(syncDbTables.statTable, stats);
};
