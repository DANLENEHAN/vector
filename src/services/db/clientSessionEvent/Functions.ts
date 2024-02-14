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
import {insertRows} from '@services/db/Utils';
import {getDeviceInfo} from '@services/system/Functions';
import {v4 as uuidv4} from 'uuid';
import {getUserDetails} from '@services/asyncStorage/Functions';

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
  } catch (error) {
    console.info("Don't have user details yet skipping...");
  }
  if (userId) {
    const clientSessionEvent: ClientSessionEventCreateSchema = {
      user_id: userId,
      event_type: eventType,
      application_version: sessionEventDeviceInfo?.version,
      brand: sessionEventDeviceInfo?.brand,
      client_session_event_id: uuidv4(),
      client_type: ClientType.USER_APP_DEVICE,
      created_at: timestampTimezone.timestamp,
      device_id: sessionEventDeviceInfo?.deviceId,
      system_version: sessionEventDeviceInfo?.systemVersion,
      timezone: timestampTimezone.timezone,
      user_agent: sessionEventDeviceInfo?.userAgent,
    };
    await insertRows(syncDbTables.clientSessionEventTable, [
      clientSessionEvent,
    ]);
  }
};
