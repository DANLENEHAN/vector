// Typing
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
// Functions
import {insertRows} from '@services/db/Functions';
import {executeSqlBatch} from '../SqlClient';

// Services
import logger from '@utils/Logger';

// Types
import {ExecutionResult} from '../Types';

/**
 * Inserts a new device record into the device table asynchronously.
 * This function takes a `DeviceCreateSchema` object representing the new device to be inserted. It then
 * calls `insertRows` with the specified device table and the device object wrapped in an array, as `insertRows`
 * expects an array of items to insert.
 * @param {DeviceCreateSchema} device - The device object to be inserted, conforming to the `DeviceCreateSchema`.
 *                                       This schema defines the structure and types of the device information
 *                                       required for insertion.
 * @returns {Promise<void>} - A promise that resolves with no value upon the successful insertion of the device.
 */
export const insertDevice = async (
  device: DeviceCreateSchema,
): Promise<void> => {
  await insertRows(syncDbTables.deviceTable, [device]);
};

/**
 * Attempts to retrieve a specific device record by its internal device ID and associated user ID from the device table asynchronously.
 *
 * The function constructs a SQL query to select a device from the specified device table where the `device_internal_id` matches the
 * provided `internalDeviceId` and the `user_id` matches the provided `userId`. If the query successfully retrieves a device, it returns
 * the device object cast to `DeviceCreateSchema`. If the query encounters an error, logs an error message with the encountered issue and
 * returns `null`. If no device is found matching the criteria, it also returns `null`. The function uses a `try-catch` block to catch and
 * handle any exceptions that occur during the execution of the SQL query, logging any such errors and returning `null` in case of exceptions.
 *
 * @param {string} internalDeviceId - The internal ID of the device to be retrieved, used in the SQL query's WHERE clause to locate the
 *                                    specific device record.
 * @param {string} userId - The ID of the user associated with the device, also used in the WHERE clause to ensure the device belongs to
 *                          the specified user.
 * @returns {Promise<DeviceCreateSchema | null>} - A promise that resolves to the device object conforming to the `DeviceCreateSchema` if
 *                                                 the device is found, or `null` if no device is found or an error occurs during execution.
 */
export const getDevice = async (
  internalDeviceId: string,
  userId: string,
): Promise<DeviceCreateSchema | null> => {
  try {
    const sqlResult: ExecutionResult[] = await executeSqlBatch([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.deviceTable} ` +
          `WHERE device_internal_id = '${internalDeviceId}' ` +
          `AND user_id = '${userId}';`,
      },
    ]);

    if (sqlResult[0].error) {
      logger.warn(`Unable to get Device with error: ${sqlResult[0].error}`);
      return null;
    }

    const device = sqlResult[0].result[0];
    if (!device) {
      return null;
    }
    return device as DeviceCreateSchema;
  } catch (error) {
    logger.error('Error fetching device', {error});
    return null;
  }
};
