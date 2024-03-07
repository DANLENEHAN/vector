// Functions
import {handleClientSessionEvent} from '@services/api/blueprints/clientSessionEvent/Functions';
import {runSyncProcess} from '@services/db/sync/SyncProcess';
import {isFirstAppEntryToday} from './Functions';
// Types
import {AppEntryType} from '@services/system/Types';
import {ClientSessionEventType} from '@services/api/swagger/data-contracts';
// Logger
import logger from '@utils/Logger';
import {checkStreakBreak} from '@services/notifcations/streak/Functions';
import {registerStreakNotifcation} from '@services/notifcations/streak/Events';
// Services
import {dbConnectionManager} from '@services/db/SqlClient';

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
export const appEntryCallback = async (
  appEntryType: AppEntryType,
  activeUserId: string,
): Promise<void> => {
  logger.info(`App Entry Event. Type: '${appEntryType}'`);

  // Create DB connection with User's DB
  await dbConnectionManager.openDatabase(activeUserId);

  // Add Entry Session Event
  await handleClientSessionEvent(ClientSessionEventType.AppOpen);

  // Only Update Streak info on the first login of the day
  const isFirstAppEntry: boolean = await isFirstAppEntryToday();
  if (isFirstAppEntry) {
    await checkStreakBreak();
    registerStreakNotifcation();
  }

  if (
    appEntryType === AppEntryType.LoginAuthed ||
    appEntryType === AppEntryType.CreateAccAuthed
  ) {
    if (appEntryType === AppEntryType.CreateAccAuthed) {
      handleClientSessionEvent(ClientSessionEventType.CreateAccount);
    }
    handleClientSessionEvent(ClientSessionEventType.LoggedIn);
  }

  // Run Sync if Online
  if (appEntryType !== AppEntryType.LoginTokenOffline) {
    await runSyncProcess();
  }
};
