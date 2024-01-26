// Typing
import {AxiosResponse} from 'axios';
import {SyncApiFunctions, SyncObject} from '@services/db/sync/Types';
import {
  StatCreateSchema,
  StatUpdateSchema,
  QuerySchema,
} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';

// Functions
import api from '@services/api/ApiService';
import {Stat} from '@services/api/swagger/Stat';

const StatApi = new Stat(api);

export const apiFunctions: SyncApiFunctions = {
  [syncDbTables.statTable]: {
    [SyncOperation.Creates]: (
      data: StatCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => StatApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: StatUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => StatApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      StatApi.postStat(data),
  },
};

export const maxSyncPushRetry = 3;
