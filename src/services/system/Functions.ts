// Functions
import DeviceInfo from 'react-native-device-info';
// Types
import {
  BaseOperators,
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
import {SessionEventDeviceInfo} from './Types';
// Logger
import logger from '@utils/Logger';
import {getRows} from '@services/db/Operations';
import {syncDbTables, timestampFields} from '@shared/Constants';
import {deviceTimestampNow, getDayBoundsOfDate} from '@services/date/Functions';
import {DayBounds} from '@services/date/Type';

/**
 * Asynchronously retrieves device information using the DeviceInfo library.
 *
 * @returns {Promise<SessionEventDeviceInfo>} A promise that resolves to an object containing various device information.
 * @throws {Error} Throws an error if there is any issue retrieving the device information.
 */
export const getDeviceInfo =
  async (): Promise<SessionEventDeviceInfo | null> => {
    try {
      // Retrieve device information using the DeviceInfo library
      const brand = DeviceInfo.getBrand();
      const systemVersion = DeviceInfo.getSystemVersion();
      const version = DeviceInfo.getVersion();

      // Retrieve user agent asynchronously
      const deviceId = await DeviceInfo.getUniqueId();
      const userAgent = await DeviceInfo.getUserAgent();

      // Return an object containing the device information
      return {
        brand,
        deviceId,
        systemVersion,
        userAgent,
        version,
      };
    } catch (error) {
      logger.warn(`Error in getDeviceInfo: ${error}`);
      return null;
    }
  };

/**
 * Determines if the current app entry is the first for the user today. This function calculates
 * the bounds of the current day based on the device's local time and queries the database for any
 * app open events within these bounds. It considers the app entry to be the first of the day if
 * exactly one app open event is found within the current day's boundaries, indicating no prior
 * app entries have been recorded for the day.
 *
 * The function relies on a generic `getRows` function for querying the database, which is configured
 * to retrieve rows from a specific table based on the provided conditions. These conditions are
 * tailored to identify app open events that occurred within the start and end of the current day,
 * using the device's timestamp to define the day's boundaries.
 *
 * @async
 * @returns {Promise<boolean>} A promise that resolves to `true` if this is the first app entry of
 *                             the day, or `false` otherwise. The determination is based on the
 *                             presence of exactly one app open event within the day's boundaries.
 *
 * @throws {Error} Implicitly handles errors through the return value. It relies on the underlying
 *                 database query mechanism to manage errors, such as network issues or data access
 *                 problems, which could affect the accuracy of the result. The function ensures that
 *                 any failure in querying is caught and does not disrupt the application's flow.
 */
export const isFirstAppEntryToday = async (): Promise<boolean> => {
  const dayBounds: DayBounds = getDayBoundsOfDate(deviceTimestampNow());
  const appOpenEvent = await getRows<ClientSessionEventCreateSchema>({
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [`${syncDbTables.clientSessionEventTable}_id`],
    whereConditions: {
      [timestampFields.createdAt]: {
        [NumericOperators.Ge]: dayBounds.startOfDay,
        [NumericOperators.Le]: dayBounds.endOfDay,
      },
      event_type: {
        [BaseOperators.Eq]: ClientSessionEventType.LoggedIn,
      },
    },
  });
  return appOpenEvent !== null && appOpenEvent.length === 1;
};
