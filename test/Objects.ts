// Types
import {
  BodyStatCreateSchema,
  BodyStatType,
  BodyStatUpdateSchema,
  WeightUnit,
} from '@services/api/swagger/data-contracts';
import {
  DateFormat,
  Gender,
  FitnessGoal,
  HeightUnit,
  ProfileStatus,
} from '@services/api/swagger/data-contracts';
import {timestampFields} from '@shared/Constants';

import {SyncType, SyncOperation} from '@shared/Enums';
import {SyncTable} from '@services/db/sync/Types';
import {syncDbTables} from '@shared/Constants';

// Objects
// Timestamp/Timezones
export const sampleTimestampOne: string = '2025-01-01T00:00:00.000';
export const sampleTimestampTwo: string = '2025-01-01T00:01:00.000';
export const sampleTimezone: string = 'Europe/Dublin';
// Uuids
export const sampleUserId = '67f6127d-13cc-4c27-b91f-2b1f83c48eec';
export const sampleEmail = 'dan@gmail.com';

export const sampleStat = {
  body_stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
  stat_type: BodyStatType.Weight,
  unit: WeightUnit.Kg,
  timezone: 'UTC',
  created_at: sampleTimestampOne,
  updated_at: sampleTimestampTwo,
  user_id: sampleUserId,
  value: 500,
} as BodyStatCreateSchema;

export const sampleUpdatedStat = {
  body_stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
  stat_type: BodyStatType.Weight,
  unit: WeightUnit.Kg,
  updated_at: sampleTimestampTwo,
  user_id: sampleUserId,
  value: 500,
} as BodyStatUpdateSchema;

export const sampleUser = {
  user_id: sampleUserId,
  email: sampleEmail,
  password: 'testing123',
  age: 125,
  birthday: '1997-05-18',
  date_format_pref: DateFormat.ValueDMY,
  first_name: 'dan',
  gender: Gender.Male,
  goal: FitnessGoal.BuildMuscle,
  height_unit_pref: HeightUnit.Cm,
  language: 'en',
  last_name: 'Lenehan',
  phone_number: '+447308821533',
  premium: false,
  status: ProfileStatus.Active,
  username: 'danlen97',
  weight_unit_pref: WeightUnit.Kg,
  [timestampFields.createdAt]: sampleTimestampOne,
  [timestampFields.timezone]: sampleTimestampTwo,
};

export const sampleSyncRow = {
  table_name: syncDbTables.bodyStatTable,
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
