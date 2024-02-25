import logger from '@utils/Logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {getStoredDeviceIdMap} from '@services/asyncStorage/Functions';
import {createDevice} from '@services/api/blueprints/device/Api';
import {DeviceApi} from '@services/api/ApiService';
import axios from 'axios';
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';

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
