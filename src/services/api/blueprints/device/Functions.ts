import logger from '@utils/Logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {getStoredDeviceIdMap} from '@services/asyncStorage/Functions';
import {createDevice} from '@services/api/blueprints/device/Api';
import {DeviceApi} from '@services/api/ApiService';
import axios from 'axios';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';

/**
 * Attempts to retrieve or register a device ID for a given user. This function first tries to fetch the unique device ID
 * using `DeviceInfo.getUniqueId()`. It then checks if this device ID is already stored locally. If not found locally,
 * it attempts to retrieve the device ID from the backend using `DeviceApi.postDevice()` with a filter for the actual
 * internal device ID. If the device is not registered on the backend (indicated by a 201 status code and empty data array),
 * it proceeds to register the device by calling `createDevice()`.
 *
 * After successfully retrieving or registering the device, the function stores the device information (internal device ID and device ID)
 * in local storage using `AsyncStorage.setItem()`.
 *
 * If any step fails, it logs the error and returns an object with `internalDeviceId` and `deviceId` set to `null`,
 * also storing this error state in local storage.
 *
 * @param userId - The ID of the user for whom the device ID retrieval or registration is being performed.
 * @returns A Promise that resolves to an object containing `internalDeviceId` and `deviceId`.
 *          If the operation is successful, these values are populated with the device's information;
 *          if the operation fails at any step, both fields are set to `null`.
 *
 * Possible errors:
 * - Network issues or server errors during the Axios calls, which are caught and logged.
 * - Local storage access issues, though the function currently does not explicitly handle or log these errors.
 *
 */
export const retrieveOrRegisterDeviceId = async (userId: string) => {
  try {
    const actualInternalDeviceId = await DeviceInfo.getUniqueId();
    let deviceMap = await getStoredDeviceIdMap(actualInternalDeviceId);

    if (!deviceMap.internalDeviceId) {
      const response = await DeviceApi.postDevice({
        filters: {device_internal_id: {eq: actualInternalDeviceId}},
      });

      if (response.status === 201 && response.data.length > 0) {
        deviceMap = {
          internalDeviceId: response.data[0].device_internal_id,
          deviceId: response.data[0].device_id,
        };
      } else if (response.status === 201 && response.data.length === 0) {
        const createResponse = await createDevice(
          userId,
          actualInternalDeviceId,
        );
        deviceMap = createResponse || {internalDeviceId: null, deviceId: null};
      } else {
        logger.warn(
          `Unexpected status code for postDevice: ${response.status}`,
        );
        deviceMap = {internalDeviceId: null, deviceId: null};
      }
    }
    await AsyncStorage.setItem(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(deviceMap),
    );
    return deviceMap;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.warn(`Error in retrieveOrRegisterDeviceId: ${error.message}`);
    }
    const errorDeviceMap = {internalDeviceId: null, deviceId: null};
    await AsyncStorage.setItem(
      AsyncStorageKeys.DeviceId,
      JSON.stringify(errorDeviceMap),
    );
    return errorDeviceMap;
  }
};
