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
  BodyBodyStatCreateSchema,
  BodyBodyStatUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class BodyStat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new body_stat.
   *
   * @tags BodyStat
   * @name CreateCreate
   * @summary Create a new body_stat.
   * @request POST:/body_stat/create
   * @secure
   * @response `204` `void` Stats retrieved successfully
   * @response `400` `void` Query parameter validation error
   */
  createCreate = (
    data: BodyBodyStatCreateSchema,
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
      path: `/body_stat/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a body_stat.
   *
   * @tags BodyStat
   * @name DeleteStringBodyStatIdDelete
   * @summary Delete a body_stat.
   * @request DELETE:/body_stat/delete/{string:body_stat_id}
   * @secure
   * @response `204` `void` BodyStat deleted successfully
   * @response `400` `void` BodyStat ID is required to delete a body_stat
   * @response `404` `void` BodyStat not found
   */
  deleteStringBodyStatIdDelete = (
    bodyStatId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/body_stat/delete/{string${bodyStatId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific stats for a user.
   *
   * @tags BodyStat
   * @name GetStringBodyStatIdList
   * @summary Get a body_stat.
   * @request GET:/body_stat/get/{string:body_stat_id}
   * @secure
   * @response `200` `BodyBodyStatCreateSchema` BodyStat for user retrieved successfully
   * @response `404` `void` BodyStat not found
   */
  getStringBodyStatIdList = (bodyStatId: string, params: RequestParams = {}) =>
    this.http.request<BodyBodyStatCreateSchema, void>({
      path: `/body_stat/get/{string${bodyStatId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get stats for a user.
   *
   * @tags BodyStat
   * @name PostBodyStat
   * @summary Get stats.
   * @request POST:/body_stat/get
   * @secure
   * @response `204` `(BodyBodyStatCreateSchema)[]` Stats found successfully
   * @response `400` `void` Query validation error
   */
  postBodyStat = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<BodyBodyStatCreateSchema[], void>({
      path: `/body_stat/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a body_stat for a user.
   *
   * @tags BodyStat
   * @name UpdateUpdate
   * @summary Update a body_stat.
   * @request PUT:/body_stat/update
   * @secure
   * @response `201` `void` BodyStat updated successfully
   * @response `400` `void` Stats validation error
   * @response `404` `void` BodyStat not found
   */
  updateUpdate = (
    data: BodyBodyStatUpdateSchema,
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
      path: `/body_stat/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
