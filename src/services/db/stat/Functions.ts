// Typing
import {StatCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Functions';

/**
 * @description Inserts an array of stats into the stat table.
 *
 * @param stats An array of StatCreateSchema objects representing the stats to be inserted.
 * @returns {Promise<void>} A promise that resolves when the stats are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * const stats: StatCreateSchema[] = [...]; // An array of StatCreateSchema objects
 * await insertStat(stats);
 */
export const insertStat = async (stats: StatCreateSchema[]): Promise<void> => {
  await insertRows(syncDbTables.statTable, stats, false);
};
