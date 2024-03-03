import moment from 'moment-timezone';
import {getTimeZone} from 'react-native-localize';

import {TimestampTimezone, DayBounds} from '@services/date/Type';
import {DateFormat, TimestampFormat} from '@shared/Enums';

export const utcTimestampNow = (): moment.Moment => {
  return moment.utc();
};

export const deviceTimestampNow = (): moment.Moment => {
  return moment.tz(getTimeZone());
};

export const deviceTimezone = (): string => {
  return getTimeZone();
};

export const timezoneTimestampNow = (timezone: string): moment.Moment => {
  return moment.tz(timezone);
};

export const getUtcNowAndDeviceTimezone = (): TimestampTimezone => {
  return {
    timestamp: momentToDateStr(
      utcTimestampNow(),
      TimestampFormat.YYYYMMDDHHMMssSSS,
    ),
    timezone: deviceTimezone(),
  };
};

export const momentToDateStr = (
  timestamp: moment.Moment,
  format: TimestampFormat | DateFormat,
): string => {
  const formattedDate = timestamp.format(format);
  return formattedDate;
};

export const getDayBoundsOfDate = (date: moment.Moment): DayBounds => {
  const startOfDay = date.clone().startOf('day');
  const endOfDay = date.clone().endOf('day');
  return {startOfDay, endOfDay};
};
