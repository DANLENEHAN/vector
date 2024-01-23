// Typing
import {AxiosResponse} from 'axios';
import {SyncApiFunctions, SyncObject} from './types';
import {
  StatCreateSchema,
  StatUpdateSchema,
  QuerySchema,
} from '@services/api/swagger/data-contracts';
import {SyncOperation} from '@shared/enums';
import {dbTables} from '@shared/Constants';

// Functions
import api from '@services/api/apiService';
import {Stat} from '@services/api/swagger/Stat';

const StatApi = new Stat(api);

export const apiFunctions: SyncApiFunctions = {
  [dbTables.statTable]: {
    [SyncOperation.Creates]: (
      data: StatCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => StatApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: StatUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => StatApi.updateUpdate(data, query),
    [SyncOperation.Gets]: (data: QuerySchema): Promise<AxiosResponse> =>
      StatApi.postStat(data),
  },
};
