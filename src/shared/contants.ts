export const dbTables = {
  syncTable: 'sync_table' as const,
  statTable: 'stat' as const,
} as const;

export const syncBatchLimit: number = 100;
