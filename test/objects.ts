// Types
import {
  StatCreateSchema,
  StatType,
  WaterUnit,
} from '@services/api/swagger/data-contracts';

import {SyncType, SyncOperation} from '@shared/enums';
import {SyncTable} from '@services/db/sync/types';
import {syncDbTables} from '@shared/Constants';

// Objects
export const sampleTimestampOne: string = '2025-01-01T00:00:00.000';
export const sampleTimestampTwo: string = '2025-01-01T00:01:00.000';

export const sampleStat = {
  stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
  stat_type: StatType.Water,
  unit: WaterUnit.Ml,
  timezone: 'UTC',
  created_at: sampleTimestampOne,
  updated_at: sampleTimestampTwo,
  user_id: 1,
  value: 500,
} as StatCreateSchema;

export const sampleSyncRow = {
  table_name: syncDbTables.statTable,
  last_synced: sampleTimestampTwo,
  sync_type: SyncType.Pull,
  sync_operation: SyncOperation.Creates,
} as SyncTable;
