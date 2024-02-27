// Typing
import {UserCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Functions';
import {executeSqlBatch} from '../SqlClient';
// Types
import {ExecutionResult} from '../Types';
// Services
import logger from '@utils/Logger';

/**
 * Asynchronously inserts a new user into the database.
 * This function takes a user object adhering to the UserCreateSchema interface and inserts it into the user table
 * specified in the syncDbTables constants. It leverages the insertRows function from the database services to
 * perform the insertion. This is a void function, indicating it does not return any value but completes the
 * insertion process or throws an error if unsuccessful.
 * @param {UserCreateSchema} user - The user object to be inserted into the database. The object structure must
 *                                  conform to the UserCreateSchema interface, which defines the expected fields
 *                                  and types for a user entity.
 * @returns {Promise<void>} A promise that resolves with no value upon successful insertion of the user record
 *                          into the database. In case of an error during the insertion process, the promise
 *                          will be rejected with an error.
 */
export const insertUser = async (user: UserCreateSchema): Promise<void> => {
  insertRows(syncDbTables.userTable, [user]);
};

/**
 * Fetches a user record by user ID from the user table asynchronously.
 * Attempts to retrieve a single user record that matches the provided `userId`. If the query is successful and
 * a user is found, the function returns the user object cast to `UserCreateSchema`. If no user is found, or if
 * an error occurs during the query execution (including SQL errors or exceptions caught in the try-catch block),
 * the function logs the error and returns `null`.
 * @param {string} userId - The ID of the user to retrieve. This ID is utilized in the SQL query's WHERE clause
 *                          to locate the specific user record in the database.
 * @returns {Promise<UserCreateSchema | null>} - A promise that resolves to the user object conforming to the
 *                                               `UserCreateSchema` if the user is found, or `null` if no user
 *                                               is found or an error occurs during execution.
 */
export const getUser = async (): Promise<UserCreateSchema | null> => {
  try {
    const sqlResult: ExecutionResult[] = await executeSqlBatch([
      {
        sqlStatement: `SELECT * FROM ${syncDbTables.userTable} LIMIT 1;`,
      },
    ]);

    if (sqlResult[0].error) {
      logger.error('Unable to get user', {error: sqlResult[0].error});
      return null;
    }

    const user = sqlResult[0].result[0];
    if (!user) {
      return null;
    }
    return user as UserCreateSchema;
  } catch (error) {
    logger.error('Error fetching user', {error});
    return null;
  }
};
