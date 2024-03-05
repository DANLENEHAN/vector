// Functions
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
import {getRows} from '@services/db/Operations';
// Types
import {
  BaseOperators,
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
import {DayBounds} from '@services/date/Type';

// Services
import logger from '@utils/Logger';
import moment from 'moment-timezone';

// Constants
import {SortOrders, syncDbTables, timestampFields} from '@shared/Constants';
import {deviceTimestampNow, getDayBoundsOfDate} from '@services/date/Functions';

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
  const endTime = latestAppOpen[0].created_at;

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
    startTime = firstAppOpen[0].created_at;
  } else {
    startTime = latestAppStreakBreak[0].created_at;
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
export const checkStreakBreak = async (): Promise<void> => {
  const timestampNow = deviceTimestampNow();
  const yesterday = timestampNow.clone().subtract(1, 'days');
  const dayBounds: DayBounds = getDayBoundsOfDate(yesterday);

  const yesterdaysAppOpenEvent = await getRows<ClientSessionEventCreateSchema>({
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
  if (yesterdaysAppOpenEvent !== null && yesterdaysAppOpenEvent.length === 0) {
    await handleClientSessionEvent(ClientSessionEventType.StreakBreak);
  } else {
    logger.info('User logged in yesterday will not end streak');
  }
};
