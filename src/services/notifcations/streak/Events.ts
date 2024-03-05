// Functions
import PushNotification from 'react-native-push-notification';
import {getStreak} from '@services/notifcations/streak/Functions';

// Services
import logger from '@utils/Logger';

// Constants
import {deviceTimestampNow} from '@services/date/Functions';
import {StreakNotifcationId} from '@services/notifcations/streak/Constants';

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
