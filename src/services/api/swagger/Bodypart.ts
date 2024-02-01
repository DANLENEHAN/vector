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

import {BodypartGetSchema, QuerySchema} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Bodypart<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Get a bodypart
   *
   * @tags Bodypart
   * @name GetIntBodypartIdList
   * @summary Get a bodypart
   * @request GET:/bodypart/get/{int:bodypart_id}
   * @response `200` `BodypartGetSchema` Bodypart retrieved successfully
   */
  getIntBodypartIdList = (bodypartId: number, params: RequestParams = {}) =>
    this.http.request<BodypartGetSchema, any>({
      path: `/bodypart/get/{int${bodypartId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get bodyparts from the database
   *
   * @tags Bodypart
   * @name PostBodypart
   * @summary Get bodyparts
   * @request POST:/bodypart/get
   * @secure
   * @response `204` `void` Bodyparts found successfully
   * @response `400` `void` Query validation error
   */
  postBodypart = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/bodypart/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
