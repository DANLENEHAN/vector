// Typing
import {AxiosResponse} from 'axios';
import {SyncApiFunctions, SyncObject} from '@services/db/sync/Types';
import {
  StatCreateSchema,
  StatUpdateSchema,
  MoodCreateSchema,
  MoodUpdateSchema,
  MoodTagUpdateSchema,
  MoodTagCreateSchema,
  MoodTagLinkCreateSchema,
  MoodTagLinkUpdateSchema,
  NutritionCreateSchema,
  NutritionUpdateSchema,
  QuerySchema,
} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';

// Functions
import api from '@services/api/ApiService';
import {Stat} from '@services/api/swagger/Stat';
import {Mood} from '@services/api/swagger/Mood';
import {MoodTag} from '@services/api/swagger/MoodTag';
import {MoodTagLink} from '@services/api/swagger/MoodTagLink';
import {Nutrition} from '@services/api/swagger/Nutrition';

// Apis
const StatApi = new Stat(api);
const MoodApi = new Mood(api);
const MoodTagApi = new MoodTag(api);
const MoodTagLinkApi = new MoodTagLink(api);
const NutritionApi = new Nutrition(api);

// Order In Which Tables Are Synced
export const apiFunctions: SyncApiFunctions = {
  // Stat
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
  // Mood
  [syncDbTables.moodTable]: {
    [SyncOperation.Creates]: (
      data: MoodCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => MoodApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: MoodUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => MoodApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      MoodApi.postMood(data),
  },
  // Mood Tag
  [syncDbTables.moodTagTable]: {
    [SyncOperation.Creates]: (
      data: MoodTagCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => MoodTagApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: MoodTagUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => MoodTagApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      MoodTagApi.postMoodTag(data),
  },
  // Mood Tag Link
  [syncDbTables.moodTagLinkTable]: {
    [SyncOperation.Creates]: (
      data: MoodTagLinkCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => MoodTagLinkApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: MoodTagLinkUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => MoodTagLinkApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      MoodTagLinkApi.postMoodTagLink(data),
  },
  // Nutrition
  [syncDbTables.nutritionTable]: {
    [SyncOperation.Creates]: (
      data: NutritionCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => NutritionApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: NutritionUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => NutritionApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      NutritionApi.postNutrition(data),
  },
};

export const maxSyncPushRetry = 3;
