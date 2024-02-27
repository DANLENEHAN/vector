import moment from 'moment';
import {getTimeZone} from 'react-native-localize';

import {TimestampTimezone} from '@services/date/Type';
import {TimestampFormat} from '@shared/Enums';

/**
 * Generates the current UTC timestamp as a formatted date string.
 *
 * @returns {string} - A formatted date string representing the current UTC timestamp in the format 'YYYY-MM-DDTHH:mm:ss.SSS'.
 */
export const utcTimestampNow = (): string => {
  // Get the current timestamp in milliseconds
  const millisecondsNow: number = new Date().getTime();

  // Convert the current timestamp to a formatted date string
  const timestampNow: string = formatDate(
    millisecondsNow,
    TimestampFormat.YYYYMMDDHHMMssSSS,
  );

  return timestampNow;
};

/**
 * Retrieves the current UTC timestamp and the timezone.
 *
 * @returns {TimestampTimezone} - An object containing the current UTC timestamp and the timezone.
 */
export const getCurrentTimestampTimezone = (): TimestampTimezone => {
  return {
    timestamp: utcTimestampNow(),
    timezone: getTimeZone(),
  };
};

/**
 * Formats a timestamp into a UTC date string with a specified format.
 *
 * @param timestamp - The timestamp to be formatted. Can be a number (for Unix timestamp), a date string, or a Moment object.
 * @param format - The format of the output date string.
 * @returns A string representing the formatted date in UTC.
 */
export const formatDate = (
  timestamp: number | string | moment.Moment,
  format: string,
): string => {
  const date = moment.utc(timestamp);
  const formattedDate = date.format(format);
  return formattedDate;
};

/**
 * Parses a formatted date string into a Unix timestamp (number of milliseconds since the Unix Epoch).
 *
 * @param formattedDate - The date string to parse.
 * @param format - The format of the input date string.
 * @returns The Unix timestamp corresponding to the given date string.
 */
export const parseDate = (formattedDate: string, format: string): number => {
  const parsedDate = moment.utc(formattedDate, format);
  return parsedDate.valueOf();
};
