import moment from 'moment';
import * as RNLocalize from 'react-native-localize';

import {TimestampTimezone} from './Type';

/**
 * Converts a Unix timestamp in milliseconds to a formatted date string.
 *
 * @param {number} timestamp - The Unix timestamp in milliseconds.
 * @returns {string} - A formatted date string in the format 'YYYY-MM-DDTHH:mm:ss.SSS'.
 *
 * @example
 * const timestamp = 1620000000000;
 * const formattedDate = millisecondsToDate(timestamp);
 * logger.info(formattedDate); // Example output: '2021-05-03T12:34:56.789'
 */
const millisecondsToDate = (timestamp: number): string => {
  // If you wish to interact with the date as a UTC date, use moment.utc:
  // This results in a date with a utc offset of +0:00:
  const date: moment.Moment = moment.utc(timestamp);
  const formattedDate: string = date.format('YYYY-MM-DDTHH:mm:ss.SSS');
  return formattedDate;
};

/**
 * Generates the current UTC timestamp as a formatted date string.
 *
 * @returns {string} - A formatted date string representing the current UTC timestamp in the format 'YYYY-MM-DDTHH:mm:ss.SSS'.
 *
 * @example
 * const currentUtcTimestamp = utcTimestampNow();
 * logger.info(currentUtcTimestamp); // Example output: '2022-01-18T15:42:30.123'
 */
const utcTimestampNow = (): string => {
  // Get the current timestamp in milliseconds
  const millisecondsNow: number = new Date().getTime();

  // Convert the current timestamp to a formatted date string
  const timestampNow: string = millisecondsToDate(millisecondsNow);

  return timestampNow;
};

/**
 * Retrieves the current UTC timestamp and the timezone.
 *
 * @returns {TimestampTimezone} - An object containing the current UTC timestamp and the timezone.
 *
 * @example
 * const currentTimestampTimezone = getCurrentTimestampTimezone();
 * logger.info(currentTimestampTimezone);
 * // Example output: { timestamp: '2022-01-18T15:42:30.123', timezone: 'America/New_York' }
 */
export const getCurrentTimestampTimezone = (): TimestampTimezone => {
  return {
    timestamp: utcTimestampNow(),
    timezone: RNLocalize.getTimeZone(),
  };
};
