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
  MoodCreateSchema,
  MoodUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Mood<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new Mood.
   *
   * @tags Mood
   * @name CreateCreate
   * @summary Create a new Mood.
   * @request POST:/mood/create
   * @secure
   * @response `204` `void` Mood retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Mood foreign key constraint not found
   */
  createCreate = (
    data: MoodCreateSchema,
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
      path: `/mood/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Mood.
   *
   * @tags Mood
   * @name DeleteStringMoodIdDelete
   * @summary Delete a Mood.
   * @request DELETE:/mood/delete/{string:mood_id}
   * @secure
   * @response `204` `void` Mood deleted successfully
   * @response `400` `void` Mood validation error
   * @response `404` `void` Mood not found
   */
  deleteStringMoodIdDelete = (moodId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/mood/delete/{string${moodId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Mood for a user.
   *
   * @tags Mood
   * @name GetStringMoodIdList
   * @summary Get a specific Mood for a user.
   * @request GET:/mood/get/{string:mood_id}
   * @secure
   * @response `200` `MoodCreateSchema` Mood for user retrieved successfully
   * @response `404` `void` Mood not found
   */
  getStringMoodIdList = (moodId: string, params: RequestParams = {}) =>
    this.http.request<MoodCreateSchema, void>({
      path: `/mood/get/{string${moodId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Mood for a user based on query.
   *
   * @tags Mood
   * @name PostMood
   * @summary Get Mood for a user based on query.
   * @request POST:/mood/get
   * @secure
   * @response `204` `(MoodCreateSchema)[]` Mood for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postMood = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<MoodCreateSchema[], void>({
      path: `/mood/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Mood for a user.
   *
   * @tags Mood
   * @name UpdateUpdate
   * @summary Update a Mood for a user.
   * @request PUT:/mood/update
   * @secure
   * @response `201` `void` Mood updated successfully
   * @response `400` `void` Mood validation error
   * @response `404` `void` Mood not found or foreign key constraint not found
   */
  updateUpdate = (
    data: MoodUpdateSchema,
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
      path: `/mood/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
