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
   * @description Create a new mood tag.
   *
   * @tags Mood Tag
   * @name CreateCreate
   * @summary Create a new mood tag.
   * @request POST:/mood_tag/create
   * @secure
   * @response `204` `void` Mood tag created successfully
   * @response `400` `void` Query parameter validation error
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
   * @description Delete a mood tag.
   *
   * @tags Mood Tag
   * @name DeleteStringMoodTagIdDelete
   * @summary Delete a mood tag.
   * @request DELETE:/mood_tag/delete/{string:mood_tag_id}
   * @secure
   * @response `204` `void` Mood tag deleted successfully
   * @response `404` `void` Mood tag not found
   */
  deleteStringMoodTagIdDelete = (
    moodTagId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/mood_tag/delete/{string${moodTagId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get a mood tag.
   *
   * @tags Mood Tag
   * @name GetStringMoodTagIdList
   * @summary Get a mood tag.
   * @request GET:/mood_tag/get/{string:mood_tag_id}
   * @secure
   * @response `200` `MoodTagCreateSchema` Mood Tag retrieved successfully
   * @response `404` `void` Mood Tag not found
   */
  getStringMoodTagIdList = (moodTagId: string, params: RequestParams = {}) =>
    this.http.request<MoodTagCreateSchema, void>({
      path: `/mood_tag/get/{string${moodTagId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get mood tags.
   *
   * @tags Mood Tag
   * @name PostMoodTag
   * @summary Get mood tags.
   * @request POST:/mood_tag/get
   * @secure
   * @response `204` `(MoodTagCreateSchema)[]` Moods found successfully
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
   * @description Update a mood tag.
   *
   * @tags Mood Tag
   * @name UpdateCreate
   * @summary Update a mood tag.
   * @request POST:/mood_tag/update
   * @secure
   * @response `204` `void` Moods retrieved successfully
   * @response `400` `void` Mood validation error
   * @response `404` `void` Mood not found
   */
  updateCreate = (
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
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
