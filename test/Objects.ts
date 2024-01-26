// Types
import {
  StatCreateSchema,
  StatType,
  StatUpdateSchema,
  WaterUnit,
} from '@services/api/swagger/data-contracts';

import {SyncType, SyncOperation} from '@shared/Enums';
import {SyncTable} from '@services/db/sync/Types';
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

export const sampleUpdatedStat = {
  stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
  stat_type: StatType.Water,
  unit: WaterUnit.Ml,
  updated_at: sampleTimestampTwo,
  user_id: 1,
  value: 500,
} as StatUpdateSchema;

export const sampleSyncRow = {
  table_name: syncDbTables.statTable,
  last_synced: sampleTimestampTwo,
  sync_type: SyncType.Pull,
  sync_operation: SyncOperation.Creates,
} as SyncTable;
