// import {
//   ClientSessionEventCreateSchema,
//   ClientSessionEventType,
// } from '@services/api/swagger/data-contracts';
// import {getRows} from '@services/db/Functions';
// import {syncDbTables, timestampFields, SortOrders} from '@shared/Constants';

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
};
