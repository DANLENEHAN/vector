// Typing
import {UserCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Functions';

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
