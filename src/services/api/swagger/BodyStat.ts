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
  BodyStatCreateSchema,
  BodyStatUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class BodyStat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new BodyStat.
   *
   * @tags BodyStat
   * @name CreateCreate
   * @summary Create a new BodyStat.
   * @request POST:/body_stat/create
   * @secure
   * @response `204` `void` BodyStat retrieved successfully
   * @response `400` `void` Bad request
   */
  createCreate = (
    data: BodyStatCreateSchema,
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
   * @description Delete a BodyStat.
   *
   * @tags BodyStat
   * @name DeleteStringObjectIdDelete
   * @summary Delete a BodyStat.
   * @request DELETE:/body_stat/delete/{string:object_id}
   * @secure
   * @response `204` `void` BodyStat deleted successfully
   * @response `400` `void` BodyStat validation error
   * @response `404` `void` BodyStat not found
   */
  deleteStringObjectIdDelete = (objectId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/body_stat/delete/{string${objectId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific BodyStat for a user.
   *
   * @tags BodyStat
   * @name GetStringObjectIdList
   * @summary Get a specific BodyStat for a user.
   * @request GET:/body_stat/get/{string:object_id}
   * @secure
   * @response `200` `BodyStatCreateSchema` BodyStat for user retrieved successfully
   * @response `404` `void` BodyStat not found
   */
  getStringObjectIdList = (objectId: string, params: RequestParams = {}) =>
    this.http.request<BodyStatCreateSchema, void>({
      path: `/body_stat/get/{string${objectId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get BodyStat for a user based on query.
   *
   * @tags BodyStat
   * @name PostBodyStat
   * @summary Get BodyStat for a user based on query.
   * @request POST:/body_stat/get
   * @secure
   * @response `204` `(BodyStatCreateSchema)[]` BodyStat for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postBodyStat = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<BodyStatCreateSchema[], void>({
      path: `/body_stat/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a BodyStat for a user.
   *
   * @tags BodyStat
   * @name UpdateUpdate
   * @summary Update a BodyStat for a user.
   * @request PUT:/body_stat/update
   * @secure
   * @response `201` `void` BodyStat updated successfully
   * @response `400` `void` BodyStat validation error
   * @response `404` `void` BodyStat not found
   */
  updateUpdate = (
    data: BodyStatUpdateSchema,
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
