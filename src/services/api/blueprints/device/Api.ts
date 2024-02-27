// Utils
import logger from '@utils/Logger';
// Functions
import DeviceInfo from 'react-native-device-info';
import {v4 as uuid4} from 'uuid';
import messaging from '@react-native-firebase/messaging';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
// Services
import {DeviceApi} from '@services/api/ApiService';
// Types
import axios, {AxiosResponse} from 'axios';
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
// Constants
import {insertDevice} from '@services/db/device/Functions';

/**
 * Asynchronously creates and registers a new device in the system, linking it to a specified user.
 * If a `deviceInternalId` is not provided or is null, a unique device identifier is generated using `DeviceInfo.getUniqueId()`.
 * The function then generates a new UUID for the device, retrieves the device's brand and model,
 * and obtains an FCM token for the device. It constructs a device object with these details,
 * including the current timestamp and timezone, and attempts to create a new device entry in the backend
 * using `DeviceApi.createCreate()`. If the backend creation is successful (HTTP status 201),
 * the device information is inserted into a local database and a link between the user and the device is created.
 *
 * @param userId - The ID of the user to link the new device with.
 * @param deviceInternalId - (Optional) An internal identifier for the device. If not provided, a unique ID will be generated.
 * @returns A `Promise` that resolves to an object containing `internalDeviceId` and `deviceId` if the device is successfully created and registered; otherwise, resolves to `null` if an error occurs or the backend response is not as expected.
 *
 * Possible errors:
 * - If `DeviceApi.createCreate()` does not respond with a status code of 201, indicating that the device creation on the backend did not proceed as expected.
 * - If any Axios request fails, for example, due to network issues or server errors, an Axios error is caught and logged, and the function resolves to `null`.
 *
 */
export const createDevice = async (
  userId: string,
  deviceInternalId?: string | null,
): Promise<DeviceCreateSchema | null> => {
  if (deviceInternalId === null || deviceInternalId === undefined) {
    deviceInternalId = await DeviceInfo.getUniqueId();
  }

  const deviceId: string = uuid4();
  const brand: string = DeviceInfo.getBrand();
  const model: string = DeviceInfo.getDeviceId(); // e.g. Iphone7,2
  const deviceFcm: string = await messaging().getToken();

  const {timestamp, timezone} = getCurrentTimestampTimezone();

  try {
    const deviceRow: DeviceCreateSchema = {
      user_id: userId,
      brand: brand,
      created_at: timestamp,
      device_fcm: deviceFcm,
      device_id: deviceId,
      device_internal_id: deviceInternalId,
      model: model,
      timezone: timezone,
    };
    const response: AxiosResponse<void> = await DeviceApi.createCreate(
      deviceRow,
    );
    if (response.status == 201) {
      await insertDevice(deviceRow);
      return deviceRow;
    } else {
      logger.warn(
        `Unexpected status code for Device createCreate: ${response.status}`,
      );
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.warn(`Unexpected error for Device createCreate: ${error.message}`);
    }
    return null;
  }
};
