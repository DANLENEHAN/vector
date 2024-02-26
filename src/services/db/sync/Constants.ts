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
  DeviceCreateSchema,
  DeviceUpdateSchema,
  UserDeviceLinkCreateSchema,
  UserDeviceLinkUpdateSchema,
  // UserCreateSchema,
  // UserUpdateSchema,
} from '@services/api/swagger/data-contracts';
import {SyncOperation, SyncType} from '@services/api/swagger/data-contracts';
import {syncDbTables} from '@shared/Constants';

// Apis
import {
  BodyStatApi,
  MoodApi,
  MoodTagApi,
  MoodTagLinkApi,
  ClientSessionEventApi,
  NutritionApi,
  DeviceApi,
  UserDeviceLinkApi,
  // UserApi,
} from '@services/api/ApiService';

// Order In Which Tables Are Synced
export const apiFunctions: SyncApiFunctions = {
  // NOTE: Will being in after backend changes
  // [syncDbTables.userTable]: {
  //   [SyncOperation.Creates]: (
  //     data: UserCreateSchema,
  //     query?: SyncObject,
  //   ): Promise<AxiosResponse> => UserApi.createCreate(data, query),
  //   [SyncOperation.Updates]: (
  //     data: UserUpdateSchema,
  //     query?: SyncObject,
  //   ): Promise<AxiosResponse> => UserApi.updateUpdate(data, query),
  //   [SyncType.Pull]: (data: QuerySchema): Promise<AxiosResponse> =>
  //     UserApi.postUser(data),
  // },
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
  [syncDbTables.deviceTable]: {
    [SyncOperation.Creates]: (
      data: DeviceCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => DeviceApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: DeviceUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => DeviceApi.updateUpdate(data, query),
  },
  [syncDbTables.userDeviceLinkTable]: {
    [SyncOperation.Creates]: (
      data: UserDeviceLinkCreateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => UserDeviceLinkApi.createCreate(data, query),
    [SyncOperation.Updates]: (
      data: UserDeviceLinkUpdateSchema,
      query?: SyncObject,
    ): Promise<AxiosResponse> => UserDeviceLinkApi.updateUpdate(data, query),
  },
};

export const maxSyncPushRetry = 3;
