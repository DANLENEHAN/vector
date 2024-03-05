import moment from 'moment-timezone';

export interface TimestampTimezone {
  timestamp: string;
  timezone: string;
}

export interface DayBounds {
  startOfDay: moment.Moment;
  endOfDay: moment.Moment;
}
