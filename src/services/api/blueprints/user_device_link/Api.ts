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
