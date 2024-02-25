// Types
import {UserDeviceLinkCreateSchema} from '@services/api/swagger/data-contracts';

// Services
import {UserDeviceLinkApi} from '@services/api/ApiService';
import logger from '@utils/Logger';

// Functions
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuid4} from 'uuid';
import {AxiosResponse} from 'axios';
import {insertRows} from '@services/db/Functions';
import {syncDbTables} from '@shared/Constants';

/**
 * Asynchronously creates a link between a user and a device in both the local database and via a backend API.
 * This function constructs a record that associates a user with a specific device, identified by their respective IDs,
 * along with the current timestamp and timezone. This record is first inserted into a local database table for user-device links.
 * Subsequently, an attempt is made to create this user-device link through a backend service using `UserDeviceLinkApi.createCreate()`.
 *
 * If the backend call does not return a status code of 201, indicating that the link creation was not successful,
 * a warning is logged. Failures in the backend API call do not prevent the local database insertion, ensuring that
 * the application can operate offline and sync later.
 *
 * @param deviceId - The unique identifier of the device to be linked with the user.
 * @param userId - The unique identifier of the user to be linked with the device.
 *
 * This function does not explicitly return a value but performs database operations and API calls,
 * which might result in side effects such as logging warnings in case of API failures.
 *
 * Possible errors include:
 * - Database insertion errors, which are not explicitly handled or logged by this function.
 * - Network issues or server errors during the Axios call to `UserDeviceLinkApi.createCreate`,
 *   with failures logged but not causing the function to terminate or throw an error.
 *
 **/
export const createUserDeviceLink = async (
  deviceId: string,
  userId: string,
) => {
  // insert into localDB here
  const {timestamp, timezone} = getCurrentTimestampTimezone();
  const userDeviceLinkRow: UserDeviceLinkCreateSchema = {
    created_at: timestamp,
    timezone: timezone,
    device_id: deviceId,
    user_id: userId,
    user_device_link_id: uuid4(),
  };
  await insertRows(syncDbTables.userDeviceLinkTable, [userDeviceLinkRow]);
  try {
    const response: AxiosResponse<void> = await UserDeviceLinkApi.createCreate(
      userDeviceLinkRow,
    );
    if (response.status !== 201) {
      logger.warn(
        `Unexpected status code for UserDeviceLinkApi.createCreate: ${response.status}`,
      );
    }
  } catch (error) {
    logger.warn(
      `UserDeviceLinkApi.createCreate request for deviceId: ${deviceId} ` +
        `and userId: ${userId} has failed. Will be picked up in the sync.`,
    );
  }
};
