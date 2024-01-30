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
  QuerySchema,
  StatCreateSchema,
  StatUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Stat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new stat.
   *
   * @tags Stat
   * @name CreateCreate
   * @summary Create a new stat.
   * @request POST:/stat/create
   * @secure
   * @response `204` `void` Stats retrieved successfully
   * @response `400` `void` Query parameter validation error
   */
  createCreate = (
    data: StatCreateSchema,
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
      path: `/stat/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a stat.
   *
   * @tags Stat
   * @name DeleteStringStatIdDelete
   * @summary Delete a stat.
   * @request DELETE:/stat/delete/{string:stat_id}
   * @secure
   * @response `204` `void` Stat deleted successfully
   * @response `400` `void` Stat ID is required to delete a stat
   * @response `404` `void` Stat not found
   */
  deleteStringStatIdDelete = (statId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/stat/delete/{string${statId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific stats for a user.
   *
   * @tags Stat
   * @name GetStringStatIdList
   * @summary Get a stat.
   * @request GET:/stat/get/{string:stat_id}
   * @secure
   * @response `200` `StatCreateSchema` Stat for user retrieved successfully
   * @response `404` `void` Stat not found
   */
  getStringStatIdList = (statId: string, params: RequestParams = {}) =>
    this.http.request<StatCreateSchema, void>({
      path: `/stat/get/{string${statId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get stats for a user.
   *
   * @tags Stat
   * @name PostStat
   * @summary Get stats.
   * @request POST:/stat/get
   * @secure
   * @response `204` `(StatCreateSchema)[]` Stats found successfully
   * @response `400` `void` Query validation error
   */
  postStat = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<StatCreateSchema[], void>({
      path: `/stat/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a stat for a user.
   *
   * @tags Stat
   * @name UpdateUpdate
   * @summary Update a stat.
   * @request PUT:/stat/update
   * @secure
   * @response `201` `void` Stat updated successfully
   * @response `400` `void` Stats validation error
   * @response `404` `void` Stat not found
   */
  updateUpdate = (
    data: StatUpdateSchema,
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
      path: `/stat/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
