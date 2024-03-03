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

export const registerStreakNotifcation = async () => {
  // Get Streak
  // call getStreak()
  // Build Notifcation Object
  // Scheduled Tomorrow at 9:00am local time
  // Message Extended Your Streak to Streak + 1
  // Send Streak

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

export const getStreak = async () => {
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

export const checkStreakBreak = async () => {
  // Get Latest AppOpen (UTC)
  // Get Local Time of Latest AppOpen
  // Get Local Time Bounds of Yesterday
  // Get UTC time of Bounds
  // Check if there was an App Open within the Bounds
  // If there was one do nothing
  // If there was none. Insert a Streak Break
  // Streak break must be EOD local time
  // Streak break of local must be converted to UTC before inserting

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
