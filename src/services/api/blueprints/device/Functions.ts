// Services
import logger from '@utils/Logger';
import axios from 'axios';
import {DeviceApi} from '@services/api/ApiService';

// Functions
import DeviceInfo from 'react-native-device-info';
import {createDevice} from '@services/api/blueprints/device/Api';
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
import {insertDevice} from '@services/db/device/Functions';
import {getDevice} from '@services/db/device/Functions';

/**
 * Attempts to retrieve an existing device record based on a device's unique ID or registers a new device if it does not exist.
 * The function begins by obtaining a unique device ID and fetching the current user's details. If either the user details
 * are not found or the device ID is null, the function returns null. If the device is not found in the database, the function
 * makes a call to an external API (`DeviceApi.postDevice`) to register the device with the specified filters. If the API call
 * is successful (returns a 201 status code) and contains device data, the device is inserted into the local database. If the
 * API call returns a 201 status but no device data, a new device is created using `createDevice` with the provided `userId`
 * and the unique device ID. The function logs warnings for unexpected status codes from the API call or errors during the process.
 * @param {string} userId - The ID of the user associated with the device. It is used when creating a new device if the device
 *                          does not already exist.
 * @returns {Promise<DeviceCreateSchema | null>} - A promise that resolves to the device object conforming to the
 *                                                 `DeviceCreateSchema` if the device is found or successfully registered,
 *                                                 or `null` if an error occurs or the device cannot be registered.
 */
export const retrieveOrRegisterDeviceId = async (
  userId: string,
): Promise<DeviceCreateSchema | null> => {
  try {
    const actualInternalDeviceId = await DeviceInfo.getUniqueId();
    if (userId == null || actualInternalDeviceId === '') {
      return null;
    }

    let deviceRow: DeviceCreateSchema | null = await getDevice(
      actualInternalDeviceId,
      userId,
    );

    if (!deviceRow) {
      const response = await DeviceApi.postDevice({
        filters: {device_internal_id: {eq: actualInternalDeviceId}},
      });

      if (response.status === 201 && response.data.length > 0) {
        deviceRow = response.data[0];
        await insertDevice(deviceRow);
      } else if (response.status === 201 && response.data.length === 0) {
        deviceRow = await createDevice(userId, actualInternalDeviceId);
      } else {
        logger.warn(
          `Unexpected status code for postDevice: ${response.status}`,
        );
      }
    }
    return deviceRow;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.warn(`Error in retrieveOrRegisterDeviceId: ${error.message}`);
    }
    return null;
  }
};
