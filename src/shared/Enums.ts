export enum SyncOperation {
  Creates = 'creates',
  Updates = 'updates',
}

export enum SyncType {
  Push = 'push',
  Pull = 'pull',
}

export enum TimestampFormat {
  ISO8601WithMilliseconds = 'YYYY-MM-DDTHH:mm:ss.SSS', // Example: 2024-02-08T10:30:36.989
}

export enum DateFormat {
  ISO8601DateOnly = 'YYYY-MM-DD', // Example: 2024-02-08
  MMDDWithSlash = 'MM/DD', // 02/08
}
