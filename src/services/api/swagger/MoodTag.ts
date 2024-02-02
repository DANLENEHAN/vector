/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  MoodTagCreateSchema,
  MoodTagUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class MoodTag<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new MoodTag.
   *
   * @tags MoodTag
   * @name CreateCreate
   * @summary Create a new MoodTag.
   * @request POST:/mood_tag/create
   * @secure
   * @response `204` `void` MoodTag retrieved successfully
   * @response `400` `void` Bad request
   */
  createCreate = (
    data: MoodTagCreateSchema,
    query?: {
      /**
       * Tells the creation endpoint if the object's origin is from the frontend via a sync.
       * @example false
       */
      isSync?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/mood_tag/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a MoodTag.
   *
   * @tags MoodTag
   * @name DeleteStringObjectIdDelete
   * @summary Delete a MoodTag.
   * @request DELETE:/mood_tag/delete/{string:object_id}
   * @secure
   * @response `204` `void` MoodTag deleted successfully
   * @response `400` `void` MoodTag validation error
   * @response `404` `void` MoodTag not found
   */
  deleteStringObjectIdDelete = (objectId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/mood_tag/delete/{string${objectId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific MoodTag for a user.
   *
   * @tags MoodTag
   * @name GetStringObjectIdList
   * @summary Get a specific MoodTag for a user.
   * @request GET:/mood_tag/get/{string:object_id}
   * @secure
   * @response `200` `MoodTagCreateSchema` MoodTag for user retrieved successfully
   * @response `404` `void` MoodTag not found
   */
  getStringObjectIdList = (objectId: string, params: RequestParams = {}) =>
    this.http.request<MoodTagCreateSchema, void>({
      path: `/mood_tag/get/{string${objectId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get MoodTag for a user based on query.
   *
   * @tags MoodTag
   * @name PostMoodTag
   * @summary Get MoodTag for a user based on query.
   * @request POST:/mood_tag/get
   * @secure
   * @response `204` `(MoodTagCreateSchema)[]` MoodTag for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postMoodTag = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<MoodTagCreateSchema[], void>({
      path: `/mood_tag/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a MoodTag for a user.
   *
   * @tags MoodTag
   * @name UpdateUpdate
   * @summary Update a MoodTag for a user.
   * @request PUT:/mood_tag/update
   * @secure
   * @response `201` `void` MoodTag updated successfully
   * @response `400` `void` MoodTag validation error
   * @response `404` `void` MoodTag not found
   */
  updateUpdate = (
    data: MoodTagUpdateSchema,
    query?: {
      /**
       * Tells the creation endpoint if the object's origin is from the frontend via a sync.
       * @example false
       */
      isSync?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/mood_tag/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
