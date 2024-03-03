// Functions
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
import PushNotification from 'react-native-push-notification';
import {getRows} from '@services/db/Operations';
// Types
import {
  BaseOperators,
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
import {DayBounds} from '@services/date/Type';
// Logger
import logger from '@utils/Logger';

// Constants
import {SortOrders, syncDbTables, timestampFields} from '@shared/Constants';
import {deviceTimestampNow, getDayBoundsOfDate} from '@services/date/Functions';

import moment from 'moment-timezone';
import {StreakNotifcationId} from './Constants';

/**
 * Schedules a local notification to encourage the user to maintain their login streak by logging in
 * before midnight. It calculates the notification time as 9:00 AM the following day from the current
 * device timestamp. The function retrieves the current streak using `getStreak`, and, if successful,
 * schedules a notification using `PushNotification.localNotificationSchedule`. The notification
 * message dynamically reflects the user's current streak and prompts the user to log in again to
 * extend their streak. This function is part of a larger effort to enhance user engagement through
 * daily reminders.
 *
 * Utilizes the `moment.js` library for date manipulation and relies on the `PushNotification` module
 * for scheduling the notification. It logs warnings and information regarding the operation's
 * success or failure using a `logger`.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the notification has been scheduled or
 *                            when it cannot be scheduled due to a missing streak. It does not return
 *                            any value upon resolution.
 *
 * @throws {Error} - If there are issues retrieving the streak or scheduling the notification, it
 *                   logs the error using `logger.warn` instead of throwing it to avoid breaking
 *                   the application flow.
 */
export const registerStreakNotifcation = async (): Promise<void> => {
  const tomorrow = deviceTimestampNow().add(1, 'days');
  const scheduleDate = new Date(
    tomorrow.year(),
    tomorrow.month(),
    tomorrow.date(),
    9,
    0,
    0,
  );
  const streak: number | null = await getStreak();
  if (streak === null) {
    logger.warn("Can't get streak will not setup streak notifcation");
  } else {
    PushNotification.localNotificationSchedule({
      id: StreakNotifcationId,
      message:
        `You've logged in ${streak} day${streak > 1 ? 's' : ''} in a row! \n` +
        `Log in before Midnight to make it ${streak + 1}!`,
      date: scheduleDate,
      allowWhileIdle: true,
    });
    logger.info(`Streak notifcation scheduled for ${scheduleDate}`);
  }
};

/**
 * Retrieves and calculates the current login streak of the user based on app open events recorded
 * in the database. It first fetches the most recent app open event to establish the end time of the
 * streak calculation. Then, it attempts to find the latest streak break event or, failing that, the
 * very first app open event to establish the start time of the streak. The streak is calculated as
 * the number of full days between these two events.
 *
 * This function employs `moment.js` for date calculations and leverages a generic `getRows` function
 * tailored for database queries within the application's infrastructure, which requires specifying
 * table names, columns to select, where conditions, order conditions, and limit for the query.
 *
 * @async
 * @returns {Promise<number | null>} A promise that resolves to the number of full days representing
 *                                    the user's current streak, or null if it cannot be calculated due
 *                                    to the absence of necessary app open events.
 *
 * @throws {Error} Implicitly handles errors by logging warning messages and returning null instead of
 *                 throwing errors directly. This is to avoid disrupting the application flow and to
 *                 handle missing data gracefully.
 */
export const getStreak = async (): Promise<number | null> => {
  // Get the Latest App Open
  const latestAppOpen = await getRows<ClientSessionEventCreateSchema>({
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [timestampFields.createdAt],
    whereConditions: {
      event_type: {
        eq: ClientSessionEventType.AppOpen,
      },
    },
    orderConditions: {[timestampFields.createdAt]: SortOrders.DESC},
    limit: 1,
  });

  if (!latestAppOpen || latestAppOpen.length === 0) {
    logger.warn(
      "Unable to calculate streak: can't retrieve latest App Open Event.",
    );
    return null;
  }
  const endTime = latestAppOpen![0].created_at;

  // Get the Latest Streak Break Or First App Open
  let startTime;
  const latestAppStreakBreak = await getRows<ClientSessionEventCreateSchema>({
    tableName: syncDbTables.clientSessionEventTable,
    selectColumns: [timestampFields.createdAt],
    whereConditions: {
      event_type: {
        eq: ClientSessionEventType.StreakBreak,
      },
    },
    orderConditions: {[timestampFields.createdAt]: SortOrders.DESC},
    limit: 1,
  });

  if (!latestAppStreakBreak || latestAppStreakBreak.length === 0) {
    const firstAppOpen = await getRows<ClientSessionEventCreateSchema>({
      tableName: syncDbTables.clientSessionEventTable,
      selectColumns: [timestampFields.createdAt],
      whereConditions: {
        event_type: {
          eq: ClientSessionEventType.AppOpen,
        },
      },
      orderConditions: {[timestampFields.createdAt]: SortOrders.ASC},
      limit: 1,
    });

    if (!firstAppOpen || firstAppOpen.length === 0) {
      logger.warn(
        "Unable to calculate streak: can't retrieve first App Open Event.",
      );
      return null;
    }
    startTime = firstAppOpen![0].created_at;
  } else {
    startTime = latestAppStreakBreak![0].created_at;
  }

  // the number of full days between the two dates
  return moment(endTime).diff(moment(startTime), 'days');
};

/**
 * Checks whether the user failed to log in the previous day, potentially indicating a streak break.
 * This function computes the start and end boundaries of the previous day and queries the database
 * for any app open events within this time frame. If no app open events are found, it concludes that
 * the user did not log in the previous day, triggering a streak break event by calling
 * `handleClientSessionEvent` with the `ClientSessionEventType.StreakBreak` event type.
 *
 * This process utilizes `moment.js` for date manipulation to determine the day boundaries and a
 * generic `getRows` function for database queries, which is designed to be flexible across different
 * types of data retrieval scenarios in the application's infrastructure.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the check is complete and the streak break
 *                          has been handled if necessary. There is no value returned upon resolution,
 *                          but a streak break event may be recorded, or an informational log may be
 *                          generated indicating the user's login activity.
 *
 * @throws {Error} Implicitly handles errors through the logging of informational messages or by the
 *                 graceful handling of no results found in database queries, rather than throwing
 *                 errors directly. This approach is chosen to avoid disrupting the application flow
 *                 and to manage the potential absence of login data in a user-friendly manner.
 */
export const checkStreakBreak = async () => {
  const timestampNow = deviceTimestampNow();
  const yesterday = timestampNow.clone().subtract(1, 'days');
  const dayBounds: DayBounds = getDayBoundsOfDate(yesterday);

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
    orderConditions: {
      [timestampFields.createdAt]: SortOrders.DESC,
    },
    limit: 1,
  });
  if (appOpenEvent !== null && appOpenEvent.length === 0) {
    await handleClientSessionEvent(ClientSessionEventType.StreakBreak);
  } else {
    logger.info('User logged in yesterday will not end streak');
  }
};
