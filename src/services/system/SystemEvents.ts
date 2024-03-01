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
import {getRows} from '@services/db/Operations';
import {SortOrders, syncDbTables, timestampFields} from '@shared/Constants';
import {
  deviceTimezone,
  deviceTimestampNow,
  fromDateTzToDateTz,
  getDayBoundsOfDate,
  momentToDateStr,
} from '@services/date/Functions';
import {DayBounds} from '@services/date/Type';
import {TimestampFormat} from '@shared/Enums';
import {checkStreakBreak} from '@services/notifcations/streak/Functions';

export const appEntryCallback = async (appEntryType: AppEntryType) => {
  logger.info(`App Entry Event. Type: '${appEntryType}'`);

  const user: UserCreateSchema | null = await getUser();
  await handleClientSessionEvent(ClientSessionEventType.AppOpen);

  const isFirstAppEntry: boolean = await isFirstAppEntryToday();

  if (isFirstAppEntry) {
    checkStreakBreak();
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
    // Streak Setup (All)
  }
};

export const isFirstAppEntryToday = async (): Promise<boolean> => {
  const timestampNow = deviceTimestampNow();
  const dayBounds: DayBounds = getDayBoundsOfDate(timestampNow);

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
  );

  if (appOpenEvent && appOpenEvent?.length === 1) {
    return true;
  }
  return false;
};
