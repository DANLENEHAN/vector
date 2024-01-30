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
   * @description Create a new mood.
   *
   * @tags Mood
   * @name CreateCreate
   * @summary Create a new mood.
   * @request POST:/mood/create
   * @secure
   * @response `204` `void` Moods retrieved successfully
   * @response `400` `void` Query parameter validation error
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
   * @description Delete a mood.
   *
   * @tags Mood
   * @name DeleteStringMoodIdDelete
   * @summary Delete a mood.
   * @request DELETE:/mood/delete/{string:mood_id}
   * @secure
   * @response `204` `void` Mood deleted successfully
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
   * @description Get moods.
   *
   * @tags Mood
   * @name GetMood
   * @summary Get moods.
   * @request GET:/mood/get
   * @secure
   * @response `204` `(MoodCreateSchema)[]` Moods found successfully
   * @response `400` `void` Query validation error
   */
  getMood = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<MoodCreateSchema[], void>({
      path: `/mood/get`,
      method: 'GET',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get a mood.
   *
   * @tags Mood
   * @name GetStringMoodIdList
   * @summary Get a mood.
   * @request GET:/mood/get/{string:mood_id}
   * @secure
   * @response `200` `MoodCreateSchema` Mood retrieved successfully
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
   * @description Update a mood.
   *
   * @tags Mood
   * @name UpdateCreate
   * @summary Update a mood.
   * @request POST:/mood/update
   * @secure
   * @response `204` `void` Moods retrieved successfully
   * @response `400` `void` Mood validation error
   * @response `404` `void` Mood not found
   */
  updateCreate = (
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
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
