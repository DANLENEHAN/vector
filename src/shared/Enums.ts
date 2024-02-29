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
  YYYYMMDDHHMMss = 'YYYY-MM-DD HH:mm:ss', // Example: 2024-02-29 16:07:41
}

export enum DateFormat {
  YYYYMMDD = 'YYYY-MM-DD', // Example: 2024-02-08
  DDMM = 'DD/MM', // 02/08
  DOW_DD_MM = 'ddd DD/MM', // Mon 02/08
}
