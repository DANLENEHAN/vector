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
   * @description Create a new MoodTagLink.
   *
   * @tags MoodTagLink
   * @name CreateCreate
   * @summary Create a new MoodTagLink.
   * @request POST:/mood_tag_link/create
   * @secure
   * @response `204` `void` MoodTagLink retrieved successfully
   * @response `400` `void` Bad request
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
   * @description Delete a MoodTagLink.
   *
   * @tags MoodTagLink
   * @name DeleteStringMoodTagLinkIdDelete
   * @summary Delete a MoodTagLink.
   * @request DELETE:/mood_tag_link/delete/{string:mood_tag_link_id}
   * @secure
   * @response `204` `void` MoodTagLink deleted successfully
   * @response `400` `void` MoodTagLink validation error
   * @response `404` `void` MoodTagLink not found
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
   * @description Get specific MoodTagLink for a user.
   *
   * @tags MoodTagLink
   * @name GetStringMoodTagLinkIdList
   * @summary Get a specific MoodTagLink for a user.
   * @request GET:/mood_tag_link/get/{string:mood_tag_link_id}
   * @secure
   * @response `200` `MoodTagLinkCreateSchema` MoodTagLink for user retrieved successfully
   * @response `404` `void` MoodTagLink not found
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
   * @description Get MoodTagLink for a user based on query.
   *
   * @tags MoodTagLink
   * @name PostMoodTagLink
   * @summary Get MoodTagLink for a user based on query.
   * @request POST:/mood_tag_link/get
   * @secure
   * @response `204` `(MoodTagLinkCreateSchema)[]` MoodTagLink for user retrieved successfully
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
   * @description Update a MoodTagLink for a user.
   *
   * @tags MoodTagLink
   * @name UpdateUpdate
   * @summary Update a MoodTagLink for a user.
   * @request PUT:/mood_tag_link/update
   * @secure
   * @response `201` `void` MoodTagLink updated successfully
   * @response `400` `void` MoodTagLink validation error
   * @response `404` `void` MoodTagLink not found
   */
  updateUpdate = (
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
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
