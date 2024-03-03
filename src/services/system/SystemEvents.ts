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
