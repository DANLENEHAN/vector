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
}

export enum DateFormat {
  YYYYMMDD = 'YYYY-MM-DD', // Example: 2024-02-08
  DDMM = 'DD/MM', // 02-08
}
