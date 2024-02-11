// Types
import {
  BodyStatCreateSchema,
  BodyStatType,
  BodyStatUpdateSchema,
  WeightUnit,
} from '@services/api/swagger/data-contracts';

import {SyncType, SyncOperation} from '@shared/Enums';
import {SyncTable} from '@services/db/sync/Types';
import {syncDbTables} from '@shared/Constants';

// Objects
export const sampleTimestampOne: string = '2025-01-01T00:00:00.000';
export const sampleTimestampTwo: string = '2025-01-01T00:01:00.000';

export const sampleTimezone: string = 'Europe/Dublin';

export const sampleStat = {
  body_stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
  stat_type: BodyStatType.Weight,
  unit: WeightUnit.Kg,
  timezone: 'UTC',
  created_at: sampleTimestampOne,
  updated_at: sampleTimestampTwo,
  user_id: 1,
  value: 500,
} as BodyStatCreateSchema;

export const sampleUpdatedStat = {
  body_stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
  stat_type: BodyStatType.Weight,
  unit: WeightUnit.Kg,
  updated_at: sampleTimestampTwo,
  user_id: 1,
  value: 500,
} as BodyStatUpdateSchema;

export const sampleSyncRow = {
  table_name: syncDbTables.statTable,
  last_synced: sampleTimestampTwo,
  sync_type: SyncType.Pull,
  sync_operation: SyncOperation.Creates,
} as SyncTable;

export const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

export const mockSystemContextData = {
  theme: 'light' as 'light' | 'dark',
  setTheme: jest.fn(),
  userPreferenceTheme: 'system' as 'system' | 'light' | 'dark',
  setUserPreferenceTheme: jest.fn(),
  isConnected: true,
  systemVarsLoaded: true,
  migrationsComplete: true,
};
