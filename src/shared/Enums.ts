export enum SyncOperation {
  Creates = 'creates',
  Updates = 'updates',
}

export enum SyncType {
  Push = 'push',
  Pull = 'pull',
}

export enum TimestampFormat {
  YYYYMMDDHHMMssSSS = 'YYYY-MM-DDTHH:mm:ss.SSS', // Example: 2024-02-08T10:30:36.989
  DD_MMM_YYYY_HHMMss = 'DD MMM YYYY HH:mm', // Example: 08 Feb 2024 10:30:36
  // Used to transform date strings into the SqlLite 'datetime' function
  SqlLiteDatetimeFormat = 'YYYY-MM-DD HH:mm:ss', // Example: 2024-02-29 16:07:41
}

export enum DateFormat {
  YYYYMMDD = 'YYYY-MM-DD', // Example: 2024-02-08
  DDMM = 'DD/MM', // 02/08
  DOW_DD_MM = 'ddd DD/MM', // Mon 02/08
  DOW = 'ddd', // Mon
  MMM = 'MMM', // Feb
  MM_YYYY = 'MMM YYYY', // February 08
  DD_MMM_YYYY = 'DD MMM YYYY', // 08 Feb 2024
  DD_MMM = 'DD MMM', // 08 Feb
}
export enum TimeFormat {
  HHMM = 'HH:mm', // 10:30
  HHMMss = 'HH:mm:ss', // 10:30:36
  HH = 'HH', // 10
}
