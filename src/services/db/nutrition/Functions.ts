// Typing
import {NutritionCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Operations';

/**
 * @description Inserts an array of nutrition entries into the nutrition table.
 *
 * @param nutritions An array of NutritionCreateSchema objects representing the nutrition entries to be inserted.
 * @returns {Promise<void>} A promise that resolves when the nutritions are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const insertNutritions = async (
  nutritions: NutritionCreateSchema[],
): Promise<void> => {
  await insertRows(syncDbTables.nutritionTable, nutritions);
};
