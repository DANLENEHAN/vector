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
  MoodTagLinkCreateSchema,
  MoodTagLinkUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class MoodTagLink<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new mood tag link.
   *
   * @tags Mood Tag Link
   * @name CreateCreate
   * @summary Create a new mood tag link.
   * @request POST:/mood_tag_link/create
   * @secure
   * @response `204` `void` Mood tag link created successfully
   * @response `400` `void` Query parameter validation error
   */
  createCreate = (
    data: MoodTagLinkCreateSchema,
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
      path: `/mood_tag_link/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a mood tag link.
   *
   * @tags Mood Tag Link
   * @name DeleteStringMoodTagLinkIdDelete
   * @summary Delete a mood tag link.
   * @request DELETE:/mood_tag_link/delete/{string:mood_tag_link_id}
   * @secure
   * @response `204` `void` Mood tag link deleted successfully
   * @response `404` `void` Mood tag link not found
   */
  deleteStringMoodTagLinkIdDelete = (
    moodTagLinkId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/mood_tag_link/delete/{string${moodTagLinkId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get a mood tag link.
   *
   * @tags Mood Tag Link
   * @name GetStringMoodTagLinkIdList
   * @summary Get a mood tag link.
   * @request GET:/mood_tag_link/get/{string:mood_tag_link_id}
   * @secure
   * @response `200` `MoodTagLinkCreateSchema` Mood Tag retrieved successfully
   * @response `404` `void` Mood Tag not found
   */
  getStringMoodTagLinkIdList = (
    moodTagLinkId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<MoodTagLinkCreateSchema, void>({
      path: `/mood_tag_link/get/{string${moodTagLinkId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get mood tag links.
   *
   * @tags Mood Tag Link
   * @name PostMoodTagLink
   * @summary Get mood tag links.
   * @request POST:/mood_tag_link/get
   * @secure
   * @response `204` `(MoodTagLinkCreateSchema)[]` Moods found successfully
   * @response `400` `void` Query validation error
   */
  postMoodTagLink = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<MoodTagLinkCreateSchema[], void>({
      path: `/mood_tag_link/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a mood tag link.
   *
   * @tags Mood Tag Link
   * @name UpdateCreate
   * @summary Update a mood tag link.
   * @request POST:/mood_tag_link/update
   * @secure
   * @response `204` `void` Moods retrieved successfully
   * @response `400` `void` Mood validation error
   * @response `404` `void` Mood not found
   */
  updateCreate = (
    data: MoodTagLinkUpdateSchema,
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
      path: `/mood_tag_link/update`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
