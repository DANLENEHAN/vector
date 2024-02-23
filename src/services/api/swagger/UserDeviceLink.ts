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
  UserDeviceLinkCreateSchema,
  UserDeviceLinkUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class UserDeviceLink<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new UserDeviceLink.
   *
   * @tags UserDeviceLink
   * @name CreateCreate
   * @summary Create a new UserDeviceLink.
   * @request POST:/user_device_link/create
   * @secure
   * @response `204` `void` UserDeviceLink retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` UserDeviceLink foreign key constraint not found
   */
  createCreate = (
    data: UserDeviceLinkCreateSchema,
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
      path: `/user_device_link/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a UserDeviceLink.
   *
   * @tags UserDeviceLink
   * @name DeleteStringUserDeviceLinkIdDelete
   * @summary Delete a UserDeviceLink.
   * @request DELETE:/user_device_link/delete/{string:user_device_link_id}
   * @secure
   * @response `204` `void` UserDeviceLink deleted successfully
   * @response `400` `void` UserDeviceLink validation error
   * @response `404` `void` UserDeviceLink not found
   */
  deleteStringUserDeviceLinkIdDelete = (
    userDeviceLinkId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/user_device_link/delete/{string${userDeviceLinkId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific UserDeviceLink for a user.
   *
   * @tags UserDeviceLink
   * @name GetStringUserDeviceLinkIdList
   * @summary Get a specific UserDeviceLink for a user.
   * @request GET:/user_device_link/get/{string:user_device_link_id}
   * @secure
   * @response `200` `UserDeviceLinkCreateSchema` UserDeviceLink for user retrieved successfully
   * @response `404` `void` UserDeviceLink not found
   */
  getStringUserDeviceLinkIdList = (
    userDeviceLinkId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<UserDeviceLinkCreateSchema, void>({
      path: `/user_device_link/get/{string${userDeviceLinkId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get UserDeviceLink for a user based on query.
   *
   * @tags UserDeviceLink
   * @name PostUserDeviceLink
   * @summary Get UserDeviceLink for a user based on query.
   * @request POST:/user_device_link/get
   * @secure
   * @response `204` `(UserDeviceLinkCreateSchema)[]` UserDeviceLink for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postUserDeviceLink = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<UserDeviceLinkCreateSchema[], void>({
      path: `/user_device_link/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a UserDeviceLink for a user.
   *
   * @tags UserDeviceLink
   * @name UpdateUpdate
   * @summary Update a UserDeviceLink for a user.
   * @request PUT:/user_device_link/update
   * @secure
   * @response `201` `void` UserDeviceLink updated successfully
   * @response `400` `void` UserDeviceLink validation error
   * @response `404` `void` UserDeviceLink not found or foreign key constraint not found
   */
  updateUpdate = (
    data: UserDeviceLinkUpdateSchema,
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
      path: `/user_device_link/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
