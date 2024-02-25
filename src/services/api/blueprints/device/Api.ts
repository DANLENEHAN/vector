// Utils
import logger from '@utils/Logger';
// Functions
import DeviceInfo from 'react-native-device-info';
import {v4 as uuid4} from 'uuid';
import messaging from '@react-native-firebase/messaging';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {createUserDeviceLink} from '../user_device_link/Api';
// Services
import {DeviceApi} from '@services/api/ApiService';
// Types
import axios, {AxiosResponse} from 'axios';
import {DeviceCreateSchema} from '@services/api/swagger/data-contracts';
// Constants
import {DeviceIdMap} from '@services/asyncStorage/Types';
import {insertRows} from '@services/db/Functions';
import {syncDbTables} from '@shared/Constants';

export const createDevice = async (
  userId: string,
  deviceInternalId?: string | null,
): Promise<DeviceIdMap | null> => {
  if (deviceInternalId === null) {
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
    const response: AxiosResponse<void> = await DeviceApi.createCreate(
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
    if (axios.isAxiosError(error)) {
      logger.warn(`Unexpected error for Device createCreate: ${error.message}`);
    }
    return null;
  }
};
