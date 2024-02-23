// Typing
import {
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
  ClientType,
} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';
// Functions
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {insertRows} from '@services/db/Functions';
import {getDeviceInfo} from '@services/system/Functions';
import {v4 as uuid4} from 'uuid';
import {getUserDetails} from '@services/asyncStorage/Functions';
import {retrieveOrRegisterDeviceId} from '@services/api/blueprints/device/Api';

// Logger
import logger from '@utils/Logger';
import {DeviceIdMap} from '@services/asyncStorage/Types';

/**
 * Inserts a client session event into the database.
 *
 * @param {number} userId - The unique identifier of the user associated with the session event.
 * @param {ClientSessionEventType} eventType - The type of client session event.
 * @throws {Error} Throws an error if there is any issue inserting the session event into the database.
 * @returns {Promise<void>} A promise that resolves once the session event is successfully inserted.
 */
export const insertClientSessionEvent = async (
  eventType: ClientSessionEventType,
): Promise<void> => {
  const sessionEventDeviceInfo = await getDeviceInfo();
  const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

  let userId = null;
  try {
    userId = await getUserDetails('user_id');

    if (userId !== null) {
      const deviceMap: DeviceIdMap = await retrieveOrRegisterDeviceId(userId);
      const clientSessionEvent: ClientSessionEventCreateSchema = {
        user_id: userId,
        event_type: eventType,
        application_version: sessionEventDeviceInfo?.version,
        client_session_event_id: uuid4(),
        client_type: ClientType.USER_APP_DEVICE,
        created_at: timestampTimezone.timestamp,
        system_version: sessionEventDeviceInfo?.systemVersion,
        timezone: timestampTimezone.timezone,
        user_agent: sessionEventDeviceInfo?.userAgent,
        device_id: deviceMap.deviceId,
      };
      await insertRows(syncDbTables.clientSessionEventTable, [
        clientSessionEvent,
      ]);
    }
  } catch (error) {
    logger.info("Don't have user details yet skipping...");
  }
};
