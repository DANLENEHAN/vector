// Functions
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
import {runSyncProcess} from '@services/db/sync/SyncProcess';
import {retrieveOrRegisterDeviceId} from '@services/api/blueprints/device/Functions';
import {getUser} from '@services/db/user/Functions';
// Types
import {AppEntryType} from '@services/system/Types';
import {
  ClientSessionEventCreateSchema,
  ClientSessionEventType,
  UserCreateSchema,
} from '@services/api/swagger/data-contracts';
// Logger
import logger from '@utils/Logger';
import {getRows} from '@services/db/Functions';
import {SortOrders, syncDbTables, timestampFields} from '@shared/Constants';
import {
  fromDateTzToDateTz,
  // deviceTimezoneNow,
  timezoneTimestampNow,
  getDayBoundsOfDate,
  momentToDateStr,
} from '@services/date/Functions';
import {DayBounds} from '@services/date/Type';
import {TimestampFormat} from '@shared/Enums';

export const appEntryCallback = async (appEntryType: AppEntryType) => {
  logger.info(`App Entry Event. Type: '${appEntryType}'`);

  const user: UserCreateSchema | null = await getUser();
  await handleClientSessionEvent(ClientSessionEventType.AppOpen);

  // Is First Login Of Today
  // call isFirstAppEntry();

  // isFirstEntry
  // Streak Break
  // call checkStreakBreak

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

  // isFirstEntry
  // Streak Setup (All)
};

export const isFirstAppEntryToday = async () => {
  // Time Now in Local
  // Get Bounds of Local Today in UTC time
  // Is there more than one AppOpen Today
  console.log('In isFirstAppEntryToday');
  const timezone = 'America/Toronto';
  const timestampNow = timezoneTimestampNow(timezone);
  const dayBounds: DayBounds = getDayBoundsOfDate(timestampNow);

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
  console.log(appOpenEvent?.length);
};
