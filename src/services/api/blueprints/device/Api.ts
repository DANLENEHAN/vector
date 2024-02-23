// Utils
import logger from '@utils/Logger';
// Functions
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {v4 as uuid4} from 'uuid';
import messaging from '@react-native-firebase/messaging';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {getStoredDeviceIdMap} from '@services/asyncStorage/Functions';
import {createUserDeviceLink} from '../user_device_link/Api';
// Services
import api from '@services/api/ApiService';
import {Device} from '@services/api/swagger/Device';
// Types
import {AxiosResponse} from 'axios';
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
// Constants
import {AsyncStorageKeys} from '@services/asyncStorage/Constants';
import {DeviceIdMap} from '@services/asyncStorage/Types';
import {insertRows} from '@services/db/Functions';
import {syncDbTables} from '@shared/Constants';

const deviceApi = new Device(api);

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
        await deviceApi.postDevice({
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
        }
        await AsyncStorage.setItem(
          AsyncStorageKeys.DeviceId,
          JSON.stringify(deviceMap),
        );
        return deviceMap;
      } else {
        logger.warn(
          `Unexpected status code for postDevice: ${response.status}`,
        );
        return deviceMap;
      }
    } catch (error) {
      logger.warn(`Unexpected error for postDevice: ${error.message}`);
      return deviceMap;
    }
  } else {
    return deviceMap;
  }
};

export const createDevice = async (
  userId: string,
  deviceInternalId?: string | null,
): Promise<DeviceIdMap | null> => {
  if (deviceInternalId == null) {
    deviceInternalId = await DeviceInfo.getUniqueId();
  }

  const deviceId: string = uuid4();
  const brand: string = DeviceInfo.getBrand();
  const model: string = DeviceInfo.getModel();
  const deviceFcm: string = await messaging().getToken();

  const {timestamp, timezone} = getCurrentTimestampTimezone();

  try {
    const deviceRow: DeviceCreateSchema = {
      brand: brand,
      created_at: timestamp,
      device_fcm: deviceFcm,
      device_id: deviceId,
      device_internal_id: deviceInternalId,
      model: model,
      timezone: timezone,
    };
    const response: AxiosResponse<void> = await deviceApi.createCreate(
      deviceRow,
    );
    if (response.status == 201) {
      await insertRows(syncDbTables.deviceTable, [deviceRow]);
      await createUserDeviceLink(deviceId, userId);
      return {
        internalDeviceId: deviceInternalId,
        deviceId: deviceId,
      };
    } else {
      logger.warn(
        `Unexpected status code for Device createCreate: ${response.status}`,
      );
      return null;
    }
  } catch (error) {
    logger.warn(`Unexpected error for Device createCreate: ${error.message}`);
    return null;
  }
};
