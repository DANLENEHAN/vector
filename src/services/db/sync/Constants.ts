// Typing
import {AxiosResponse} from 'axios';
import {SyncApiFunctions, SyncObject} from '@services/db/sync/Types';
import {
  BodyStatCreateSchema,
  BodyStatUpdateSchema,
  MoodCreateSchema,
  MoodUpdateSchema,
  MoodTagUpdateSchema,
  MoodTagCreateSchema,
  MoodTagLinkCreateSchema,
  MoodTagLinkUpdateSchema,
  NutritionCreateSchema,
  NutritionUpdateSchema,
  QuerySchema,
  ClientSessionEventCreateSchema,
  ClientSessionEventUpdateSchema,
} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';

// Functions
import api from '@services/api/ApiService';
import {BodyStat} from '@services/api/swagger/BodyStat';
import {Mood} from '@services/api/swagger/Mood';
import {MoodTag} from '@services/api/swagger/MoodTag';
import {MoodTagLink} from '@services/api/swagger/MoodTagLink';
import {Nutrition} from '@services/api/swagger/Nutrition';
import {ClientSessionEvent} from '@services/api/swagger/ClientSessionEvent';

// Apis
const BodyStatApi = new BodyStat(api);
const MoodApi = new Mood(api);
const MoodTagApi = new MoodTag(api);
const MoodTagLinkApi = new MoodTagLink(api);
const NutritionApi = new Nutrition(api);
const ClientSessionEventApi = new ClientSessionEvent(api);

// Order In Which Tables Are Synced
export const apiFunctions: SyncApiFunctions = {
  // BodyStat
  [syncDbTables.bodyStatTable]: {
    [SyncOperation.Creates]: (
      data: BodyStatCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => BodyStatApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: BodyStatUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => BodyStatApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      BodyStatApi.postBodyStat(data),
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
  // ClientSessionEvent
  [syncDbTables.clientSessionEventTable]: {
    [SyncOperation.Creates]: (
      data: ClientSessionEventCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> =>
      ClientSessionEventApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: ClientSessionEventUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> =>
      ClientSessionEventApi.updateUpdate(data, query),
    [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
      ClientSessionEventApi.postClientSessionEvent(data),
  },
};

export const maxSyncPushRetry = 3;
