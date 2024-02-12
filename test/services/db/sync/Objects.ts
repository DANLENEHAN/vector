import {SyncOperation, SyncType} from '@shared/Enums';

export const sampleCreatedAtTimestamp: string = '2025-01-01T00:00:00.000';
export const sampleUpdatedAtTimestamp: string = '2025-01-01T13:00:00.000';
export const sampleSyncStartTimestamp: string = '2025-01-02T00:00:00.000';

export const getQueryObjForTableSampleResponse = {
  filters: {
    and: {
      created_at: {
        gt: sampleCreatedAtTimestamp,
        le: sampleUpdatedAtTimestamp,
      },
    },
  },
  sort: ['created_at:asc'],
};

export const createCreateSpy = jest.fn();
export const updateUpdateSpy = jest.fn();
export const postBodyStatSpy = jest.fn();

export const TableFunctionsMock = {
  [SyncOperation.Updates]: updateUpdateSpy,
  [SyncOperation.Creates]: createCreateSpy,
  [SyncType.Pull]: postBodyStatSpy,
};
