import {SyncOperation, SyncType} from 'src/shared/enums';
import {syncBatchLimit} from 'src/shared/contants';

export const getLastSyncedForTableQuery = (
  tableName: string,
  syncType: SyncType,
  syncOperation: SyncOperation,
): string => `
    SELECT last_synced
    FROM sync_table
    WHERE table_name = '${tableName}' AND sync_type = '${syncType}' AND sync_operation = '${syncOperation}';
`;

export const getRowsToSyncQuery = (
  tableName: string,
  syncOperation: SyncOperation,
  lastSyncTime?: string,
): string => {
  let query = `
    SELECT *
    FROM ${tableName}
  `;

  const timstamp_field =
    syncOperation === 'creates' ? 'created_at' : 'updated_at';
  if (lastSyncTime !== undefined) {
    query += `WHERE ${timstamp_field} > '${lastSyncTime}' `;
  } else {
    // In the event there's been no sync for this type yet
    // Will just get all creates or updates
    query += `WHERE ${timstamp_field} IS NOT NULL `;
  }

  query += ` ORDER BY created_at ASC, updated_at ASC LIMIT ${syncBatchLimit};`;
  return query;
};
