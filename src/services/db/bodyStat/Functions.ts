// Typing
import {BodyStatCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {insertRows} from '@services/db/Operations';

/**
 * @description Inserts an array of stats into the body_stat table.
 *
 * @param stats An array of BodyStatCreateSchema objects representing the stats to be inserted.
 * @returns {Promise<void>} A promise that resolves when the stats are successfully inserted.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const insertBodyStat = async (
  stats: BodyStatCreateSchema[],
): Promise<void> => {
  await insertRows<BodyStatCreateSchema>(syncDbTables.bodyStatTable, stats);
};

interface getBodyStatsInterface {
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
export const getBodyStats = async ({
  columns,
  whereClause,
}: getBodyStatsInterface): Promise<BodyStatCreateSchema[]> => {
  const query = {
    sqlStatement: `SELECT ${columns.join(', ')} FROM body_stat ${
      whereClause ? `WHERE ${whereClause}` : ''
    };`,
    params: [],
  };
  const result = await executeSqlBatch([query]);
  const stats = result[0].result;
  return stats as BodyStatCreateSchema[];
};
