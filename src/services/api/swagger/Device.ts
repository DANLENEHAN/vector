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
  DeviceCreateSchema,
  DeviceUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Device<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new Device.
   *
   * @tags Device
   * @name CreateCreate
   * @summary Create a new Device.
   * @request POST:/device/create
   * @secure
   * @response `204` `void` Device retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Device foreign key constraint not found
   */
  createCreate = (
    data: DeviceCreateSchema,
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
      path: `/device/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Device.
   *
   * @tags Device
   * @name DeleteDelete
   * @summary Delete a Device.
   * @request DELETE:/device/delete/{device_id}
   * @secure
   * @response `204` `void` Device deleted successfully
   * @response `400` `void` Device validation error
   * @response `404` `void` Device not found
   */
  deleteDelete = (deviceId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/device/delete/${deviceId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Device for a user.
   *
   * @tags Device
   * @name GetDevice
   * @summary Get a specific Device for a user.
   * @request GET:/device/get/{device_id}
   * @secure
   * @response `200` `DeviceCreateSchema` Device for user retrieved successfully
   * @response `404` `void` Device not found
   */
  getDevice = (deviceId: string, params: RequestParams = {}) =>
    this.http.request<DeviceCreateSchema, void>({
      path: `/device/get/${deviceId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Device for a user based on query.
   *
   * @tags Device
   * @name PostDevice
   * @summary Get Device for a user based on query.
   * @request POST:/device/get
   * @secure
   * @response `204` `(DeviceCreateSchema)[]` Device for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postDevice = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<DeviceCreateSchema[], void>({
      path: `/device/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Device for a user.
   *
   * @tags Device
   * @name UpdateUpdate
   * @summary Update a Device for a user.
   * @request PUT:/device/update
   * @secure
   * @response `201` `void` Device updated successfully
   * @response `400` `void` Device validation error
   * @response `404` `void` Device not found or foreign key constraint not found
   */
  updateUpdate = (
    data: DeviceUpdateSchema,
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
      path: `/device/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
