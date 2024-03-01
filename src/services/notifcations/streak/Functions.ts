// Functions
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
// Types
import {
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
} from '@services/api/swagger/data-contracts';
// Logger
import logger from '@utils/Logger';
import {getRows} from '@services/db/Operations';
import {SortOrders, syncDbTables, timestampFields} from '@shared/Constants';
import {
  fromDateTzToDateTz,
  deviceTimezone,
  deviceTimestampNow,
  getDayBoundsOfDate,
  momentToDateStr,
} from '@services/date/Functions';
import {DayBounds} from '@services/date/Type';
import {TimestampFormat} from '@shared/Enums';

export const registerStreakNotifcation = async () => {
  // Get Streak
  // call getStreak()
  // Build Notifcation Object
  // Scheduled Tomorrow at 9:00am local time
  // Message Extended Your Streak to Streak + 1
  // Send Streak
};

export const getStreak = async () => {
  // Get Last Streak Break
  // Get Latest AppOpen
  // Convert both to Local Timezone
  // Work out Streak
  // AppOpen - Streak Break in days

  // Get the Latest App Open
  const latestAppOpen = await getRows<ClientSessionEventCreateSchema>(
    syncDbTables.clientSessionEventTable,
    ['*'],
    `event_type = '${ClientSessionEventType.AppOpen}'`,
    `${timestampFields.createdAt} ${SortOrders.DESC}`,
    1,
  );
  if (!latestAppOpen || latestAppOpen.length === 0) {
    logger.warn(
      "Unable to calculate streak: can't retrieve latest App Open Event.",
    );
    return null;
  }
  const endTime = latestAppOpen![0].created_at;

  // Get the Latest Streak Break Or First App Open
  let startTime;
  const latestAppStreakBreak = await getRows<ClientSessionEventCreateSchema>(
    syncDbTables.clientSessionEventTable,
    ['*'],
    `event_type = '${ClientSessionEventType.StreakBreak}'`,
    `${timestampFields.createdAt} ${SortOrders.DESC}`,
    1,
  );
  if (!latestAppStreakBreak || latestAppStreakBreak.length === 0) {
    const firstAppOpen = await getRows<ClientSessionEventCreateSchema>(
      syncDbTables.clientSessionEventTable,
      ['*'],
      `event_type = '${ClientSessionEventType.AppOpen}'`,
      `${timestampFields.createdAt} ${SortOrders.ASC}`,
      1,
    );
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

  console.log(startTime, endTime);
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

  const timezone = deviceTimezone();
  const appOpenEvent = await getRows<ClientSessionEventCreateSchema>(
    syncDbTables.clientSessionEventTable,
    ['*'],
    `event_type = '${ClientSessionEventType.AppOpen}' ` +
      `AND datetime(${timestampFields.createdAt}) >= '${momentToDateStr(
        fromDateTzToDateTz(dayBounds.startOfDay, timezone, 'UTC'),
        TimestampFormat.YYYYMMDDHHMMss,
      )}' ` +
      `AND datetime(${timestampFields.createdAt}) <= '${momentToDateStr(
        fromDateTzToDateTz(dayBounds.endOfDay, timezone, 'UTC'),
        TimestampFormat.YYYYMMDDHHMMss,
      )}'`,
    `${timestampFields.createdAt} ${SortOrders.DESC}`,
    1,
  );

  if (appOpenEvent && appOpenEvent.length === 0) {
    await handleClientSessionEvent(ClientSessionEventType.StreakBreak);
  } else {
    logger.info('User logged in yesterday will not end streak');
  }
};
