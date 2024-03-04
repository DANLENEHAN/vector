import moment from 'moment-timezone';
import {getTimeZone} from 'react-native-localize';

import {TimestampTimezone, DayBounds} from '@services/date/Type';
import {DateFormat, TimestampFormat} from '@shared/Enums';

/**
 * Generates the current UTC timestamp using the `moment.js` library.
 *
 * This function provides a simple and standardized way to obtain the current time in UTC format,
 * facilitating consistency across features that require time tracking or scheduling without
 * timezone offsets. It's particularly useful in contexts where operations are time-sensitive and
 * need to be synchronized across different time zones.
 *
 * @returns {moment.Moment} The current UTC timestamp as a `moment` object.
 */
export const utcTimestampNow = (): moment.Moment => {
  return moment.utc();
};

/**
 * Retrieves the current timestamp adjusted to the device's local timezone.
 *
 * Utilizing the `moment-timezone` library, this function fetches the current time and adjusts it
 * according to the device's timezone, obtained through `getTimeZone()`. This is essential for
 * features requiring time calculations that are sensitive to the user's local time, such as
 * scheduling notifications or logging activities.
 *
 * @returns {moment.Moment} The current timestamp as a `moment` object, adjusted to the device's
 *                          local timezone.
 */
export const deviceTimestampNow = (): moment.Moment => {
  return moment.tz(getTimeZone());
};

/**
 * Returns the device's current timezone as a string.
 *
 * This function wraps a call to `getTimeZone()`, providing a straightforward way to access the
 * device's timezone setting. It's useful for operations that need to adapt to the user's local
 * timezone, such as displaying times in a user-friendly format or performing timezone-specific
 * calculations.
 *
 * @returns {string} The timezone identifier of the device, e.g., 'America/New_York'.
 */
export const deviceTimezone = (): string => {
  return getTimeZone();
};

/**
 * Generates the current timestamp for a specified timezone using the `moment-timezone` library.
 *
 * This function is designed to obtain the current time adjusted to any given timezone. It is
 * particularly useful for displaying the current time to users in their local timezone or for
 * scheduling events that are timezone-specific. The flexibility of specifying the timezone makes
 * it versatile for a wide range of applications where time zone accuracy is critical.
 *
 * @param {string} timezone - The timezone ID (e.g., 'Europe/London') for which the current
 *                            timestamp is to be generated.
 * @returns {moment.Moment} - The current timestamp as a `moment` object, adjusted to the specified
 *                            timezone.
 */
export const timezoneTimestampNow = (timezone: string): moment.Moment => {
  return moment.tz(timezone);
};

/**
 * Retrieves the current UTC timestamp and the device's timezone.
 *
 * This function combines two operations: it converts the current UTC time to a string formatted
 * according to a predefined timestamp format (YYYYMMDDHHMMssSSS) and fetches the device's timezone
 * setting. The result is an object that includes both the formatted UTC timestamp and the device's
 * timezone identifier, making it suitable for scenarios where both pieces of information are
 * required simultaneously, such as logging events with time and timezone context or scheduling
 * tasks that depend on precise time and location data.
 *
 * @returns {TimestampTimezone} An object containing the formatted UTC timestamp and the device's
 *                              timezone identifier.
 */
export const getUtcNowAndDeviceTimezone = (): TimestampTimezone => {
  return {
    timestamp: momentToDateStr(
      utcTimestampNow(),
      TimestampFormat.YYYYMMDDHHMMssSSS,
    ),
    timezone: deviceTimezone(),
  };
};

/**
 * Formats a given moment timestamp into a string based on the specified format.
 *
 * This utility function leverages `moment.js` to format timestamps, allowing for flexible
 * representation of date and time. The function accepts a moment object and a format specifier,
 * which could either represent a custom timestamp format (e.g., 'YYYY-MM-DD HH:mm:ss.SSS') or a
 * predefined date format. It's particularly useful for converting timestamps to human-readable
 * strings or for preparing data for serialization and storage where a specific date format is
 * required.
 *
 * @param {moment.Moment} timestamp - The moment timestamp to format.
 * @param {TimestampFormat | DateFormat} format - The format to apply to the timestamp, defined
 *                                                 either as a custom string or a predefined format
 *                                                 enum.
 * @returns {string} The formatted date string.
 */
export const momentToDateStr = (
  timestamp: moment.Moment,
  format: TimestampFormat | DateFormat,
): string => {
  const formattedDate = timestamp.format(format);
  return formattedDate;
};

/**
 * Computes the start and end boundaries of a given date.
 *
 * This function is designed to determine the exact beginning and ending moments of a day for a
 * given date, using the `moment.js` library. By cloning the input date and setting it to the start
 * and end of that day, it effectively provides the precise timestamps that mark the very beginning
 * (00:00:00.000) and the very end (23:59:59.999) of the day. This can be especially useful for
 * filtering events, logs, or data entries that are date-specific, ensuring accuracy in calculations
 * and data retrieval that are dependent on daily boundaries.
 *
 * @param {moment.Moment} date - The date for which to calculate the day boundaries.
 * @returns {DayBounds} An object containing the start and end timestamps of the day, both as
 *                      `moment` objects.
 */
export const getDayBoundsOfDate = (date: moment.Moment): DayBounds => {
  const startOfDay = date.clone().startOf('day');
  const endOfDay = date.clone().endOf('day');
  return {startOfDay, endOfDay};
};
