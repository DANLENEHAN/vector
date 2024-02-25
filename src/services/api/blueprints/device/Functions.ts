// Utils
import logger from '@utils/Logger';
// Functions
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {getStoredDeviceIdMap} from '@services/asyncStorage/Functions';
import {createDevice} from '@services/api/blueprints/device/Api';
// Services
import {DeviceApi} from '@services/api/ApiService';
// Types
import axios, {AxiosResponse} from 'axios';
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
// Constants
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import {DeviceIdMap} from '@services/asyncStorage/Types';

export const retrieveOrRegisterDeviceId = async (
  userId: string,
): Promise<DeviceIdMap> => {
  const actualInternalDeviceId = await DeviceInfo.getUniqueId();
  let deviceMap: DeviceIdMap = await getStoredDeviceIdMap(
    actualInternalDeviceId,
  );

  if (deviceMap.internalDeviceId === null) {
    try {
      // We have to use the Query Endpoint as we aren't querying the 'device_id' of the device
      // table but instead the 'device_internal_id'
      const response: AxiosResponse<DeviceCreateSchema[]> =
        await DeviceApi.postDevice({
          filters: {
            device_internal_id: {
              eq: actualInternalDeviceId,
            },
          },
        });
      if (response.status === 201 && response.data.length > 0) {
        const deviceRow: DeviceCreateSchema = response.data[0];
        deviceMap = {
          internalDeviceId: deviceRow.device_internal_id,
          deviceId: deviceRow.device_id,
        };
        await AsyncStorage.setItem(
          AsyncStorageKeys.DeviceId,
          JSON.stringify(deviceMap),
        );
        return deviceMap;
      } else if (response.data.length === 0) {
        const createResponse = await createDevice(
          userId,
          actualInternalDeviceId,
        );
        if (createResponse !== null) {
          deviceMap = createResponse;
          await AsyncStorage.setItem(
            AsyncStorageKeys.DeviceId,
            JSON.stringify(deviceMap),
          );
        }
        return deviceMap;
      } else {
        logger.warn(
          `Unexpected status code for postDevice: ${response.status}`,
        );
        return deviceMap;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.warn(`Unexpected error for postDevice: ${error.message}`);
      }
      return deviceMap;
    }
  } else {
    return deviceMap;
  }
};
