import momentTz from 'moment-timezone';
import {getTimeZone} from 'react-native-localize';

import {TimestampTimezone, DayBounds} from '@services/date/Type';
import {DateFormat, TimestampFormat} from '@shared/Enums';

export const timezoneTimestampNow = (
  timezone: string = 'UTC',
): momentTz.Moment => {
  return momentTz.tz(timezone);
};

export const getUtcNowAndDeviceTimezone = (): TimestampTimezone => {
  return {
    timestamp: momentToDateStr(
      timezoneTimestampNow(),
      TimestampFormat.YYYYMMDDHHMMssSSS,
    ),
    timezone: getTimeZone(),
  };
};

export const momentToDateStr = (
  timestamp: momentTz.Moment,
  format: TimestampFormat | DateFormat,
): string => {
  const formattedDate = timestamp.format(format);
  return formattedDate;
};

export const dateStrToMoment = (
  dateStr: string,
  format: TimestampFormat | DateFormat,
): momentTz.Moment => {
  return momentTz(dateStr, format);
};

export const fromDateTzToDateTz = (
  fromDate: momentTz.Moment,
  fromTz: string,
  toTz: string,
) => {
  const adjustedFromDate = momentTz.tz(fromDate, fromTz);
  return adjustedFromDate.tz(toTz);
};

export const getDayBoundsOfDate = (date: momentTz.Moment): DayBounds => {
  const startOfDay = date.clone().startOf('day');
  const endOfDay = date.clone().endOf('day');
  return {startOfDay, endOfDay};
};
