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
  EquipmentCreateSchema,
  EquipmentUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Equipment<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new Equipment.
   *
   * @tags Equipment
   * @name CreateCreate
   * @summary Create a new Equipment.
   * @request POST:/equipment/create
   * @secure
   * @response `204` `void` Equipment retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Equipment foreign key constraint not found
   */
  createCreate = (
    data: EquipmentCreateSchema,
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
      path: `/equipment/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Equipment.
   *
   * @tags Equipment
   * @name DeleteStringObjectIdDelete
   * @summary Delete a Equipment.
   * @request DELETE:/equipment/delete/{string:object_id}
   * @secure
   * @response `204` `void` Equipment deleted successfully
   * @response `400` `void` Equipment validation error
   * @response `404` `void` Equipment not found
   */
  deleteStringObjectIdDelete = (objectId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/equipment/delete/{string${objectId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Equipment for a user.
   *
   * @tags Equipment
   * @name GetStringObjectIdList
   * @summary Get a specific Equipment for a user.
   * @request GET:/equipment/get/{string:object_id}
   * @secure
   * @response `200` `EquipmentCreateSchema` Equipment for user retrieved successfully
   * @response `404` `void` Equipment not found
   */
  getStringObjectIdList = (objectId: string, params: RequestParams = {}) =>
    this.http.request<EquipmentCreateSchema, void>({
      path: `/equipment/get/{string${objectId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Equipment for a user based on query.
   *
   * @tags Equipment
   * @name PostEquipment
   * @summary Get Equipment for a user based on query.
   * @request POST:/equipment/get
   * @secure
   * @response `204` `(EquipmentCreateSchema)[]` Equipment for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postEquipment = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<EquipmentCreateSchema[], void>({
      path: `/equipment/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Equipment for a user.
   *
   * @tags Equipment
   * @name UpdateUpdate
   * @summary Update a Equipment for a user.
   * @request PUT:/equipment/update
   * @secure
   * @response `201` `void` Equipment updated successfully
   * @response `400` `void` Equipment validation error
   * @response `404` `void` Equipment not found or foreign key constraint not found
   */
  updateUpdate = (
    data: EquipmentUpdateSchema,
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
      path: `/equipment/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
