// Functions
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
import {runSyncProcess} from '@services/db/sync/SyncProcess';
import {retrieveOrRegisterDeviceId} from '@services/api/blueprints/device/Functions';
import {getUser} from '@services/db/user/Functions';
// Types
import {AppEntryType} from '@services/system/Types';
import {
  BaseOperators,
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
  NumericOperators,
  UserCreateSchema,
} from '@services/api/swagger/data-contracts';
// Logger
import logger from '@utils/Logger';
import {getRows} from '@services/db/Operations';
import {syncDbTables, timestampFields} from '@shared/Constants';
import {deviceTimestampNow, getDayBoundsOfDate} from '@services/date/Functions';
import {DayBounds} from '@services/date/Type';
import {
  checkStreakBreak,
  registerStreakNotifcation,
} from '@services/notifcations/streak/Functions';

/**
 * Handles various app entry events, logging the entry type, checking and updating user session
 * events, and managing streak notifications based on the type of app entry. This function serves
 * multiple purposes based on the app entry type parameter it receives, which includes logging
 * the app entry event, ensuring that a user session event for app opening is recorded, checking
 * for streak breaks if it's the first app entry of the day, handling specific events related to
 * account creation and login, running a synchronization process unless the entry type is an
 * offline token login, and finally, registering a notification for the streak if it's the first
 * entry of the day.
 *
 * The function employs several asynchronous operations to interact with the user's session data,
 * check for streak continuity, and update the device registration as necessary. It is designed to
 * work seamlessly with other components of the app's session management and user engagement
 * strategies.
 *
 * @param {AppEntryType} appEntryType - The type of app entry event, which dictates the specific
 *                                      actions to be taken by the function.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves once all the operations triggered by the app
 *                          entry type have been executed. It does not return any value upon
 *                          resolution, but it performs several updates and checks related to the
 *                          user's session and engagement with the app.
 *
 * @throws {Error} While the function itself does not explicitly throw errors, it relies on
 *                 asynchronous operations that may throw errors due to database access issues,
 *                 network problems, or other unforeseen circumstances. These are handled
 *                 internally within the called functions, ensuring the app's flow is not disrupted.
 */
export const appEntryCallback = async (appEntryType: AppEntryType) => {
  logger.info(`App Entry Event. Type: '${appEntryType}'`);

  const user: UserCreateSchema | null = await getUser();
  await handleClientSessionEvent(ClientSessionEventType.AppOpen);

  const isFirstAppEntry: boolean = await isFirstAppEntryToday();

  if (isFirstAppEntry) {
    await checkStreakBreak();
  }

  if (
    appEntryType === AppEntryType.LoginAuthed ||
    appEntryType === AppEntryType.CreateAccAuthed
  ) {
    if (appEntryType === AppEntryType.CreateAccAuthed) {
      await handleClientSessionEvent(ClientSessionEventType.CreateAccount);
    }
    await handleClientSessionEvent(ClientSessionEventType.LoggedIn);
  }

  if (appEntryType !== AppEntryType.LoginTokenOffline) {
    await runSyncProcess();
    if (user != null) {
      await retrieveOrRegisterDeviceId(user.user_id);
    }
  }

  if (isFirstAppEntry) {
    await registerStreakNotifcation();
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
        [BaseOperators.Eq]: ClientSessionEventType.AppOpen,
      },
    },
  });
  return appOpenEvent !== null && appOpenEvent.length === 1;
};
