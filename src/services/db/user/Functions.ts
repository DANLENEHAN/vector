// Typing
import {UserCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows, getRows} from '@services/db/Operations';
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
  insertRows(syncDbTables.userTable, [{...user, superuser: false}]);
};

/**
 * Asynchronously retrieves the first user from the database.
 * This function queries the user table specified in the syncDbTables constants to fetch the first user record
 * adhering to the UserCreateSchema interface. It leverages the getRows function from the database services with
 * a limit of 1 to ensure only the first user is fetched. If a user is found, it returns the user object;
 * otherwise, it logs an error and returns null, indicating no user was found or an error occurred in retrieval.
 *
 * @returns {Promise<UserCreateSchema | null>} A promise that resolves with the first user object conforming to the
 *                                             UserCreateSchema interface if a user is successfully retrieved from
 *                                             the database. If no user is found or an error occurs during retrieval,
 *                                             the promise resolves to null. The function logs an error message in
 *                                             case of failure to retrieve a user.
 */
export const getUser = async (): Promise<UserCreateSchema | null> => {
  const response: UserCreateSchema[] | null = await getRows<UserCreateSchema>({
    tableName: syncDbTables.userTable,
    limit: 1,
  });
  if (response !== null && response.length > 0) {
    return response[0];
  } else {
    logger.error('Unable to retrieve user...not good!');
  }
  return null;
};
