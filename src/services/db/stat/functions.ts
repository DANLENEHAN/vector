import {StatSchema} from '../../api/swagger/data-contracts';

import {statTable} from './types';
import {insertRows} from '../functions';

/**
 * @description Inserts an array of stats into the stat table.
 *
 * @param stats An array of StatSchema objects representing the stats to be inserted.
 * @returns {Promise<void>} A promise that resolves when the stats are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * const stats: StatSchema[] = [...]; // An array of StatSchema objects
 * await insertStat(stats);
 */
export const insertStat = async (stats: StatSchema[]): Promise<void> => {
  await insertRows(statTable, stats);
};
