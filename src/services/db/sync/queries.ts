import {syncBatchLimit} from './types';

export const getSyncInfoForTableQuery = (tableName: string): string => `
    SELECT last_synced
    FROM sync_table
    WHERE table_name = '${tableName}' AND sync_type = 'push';
`;

export const getRowsToSyncQuery = (
  tableName: string,
  lastSyncTime?: string,
): string => {
  let query = `
    SELECT *
    FROM ${tableName}
  `;

  if (lastSyncTime !== undefined) {
    query += `WHERE (created_at > '${lastSyncTime}' OR updated_at > '${lastSyncTime}')`;
  }

  query += ` ORDER BY created_at, updated_at LIMIT ${syncBatchLimit};`;
  return query;
};
