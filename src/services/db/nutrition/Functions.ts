// Typing
import {NutritionCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
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
  await insertRows<NutritionCreateSchema>(
    syncDbTables.nutritionTable,
    nutritions,
  );
};

interface getNutritionInterface {
  columns: string[];
  whereClause?: string;
}
/**
 * Function to get all body stats from the database.
 *
 * @returns {Promise<BodyStatCreateSchema[]>} A promise that resolves to an array of BodyStatCreateSchema objects.
 * @throws {Error} Throws an error if there's a problem executing the SQL queries.
 * @throws {Error} Throws an error if no body stats are found.
 */
export const getNutritions = async ({
  columns,
  whereClause,
}: getNutritionInterface): Promise<NutritionCreateSchema[]> => {
  const query = {
    sqlStatement: `SELECT ${columns.join(', ')} FROM nutrition ${
      whereClause ? `WHERE ${whereClause}` : ''
    };`,
    params: [],
  };
  const result = await executeSqlBatch([query]);
  const stats = result[0].result;
  return stats as NutritionCreateSchema[];
};
