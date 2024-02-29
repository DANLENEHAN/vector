import momentTz from 'moment-timezone';

export interface TimestampTimezone {
  timestamp: string;
  timezone: string;
}

export interface DayBounds {
  startOfDay: momentTz.Moment;
  endOfDay: momentTz.Moment;
}
