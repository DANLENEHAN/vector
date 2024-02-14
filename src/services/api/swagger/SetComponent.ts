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
  SetComponentCreateSchema,
  SetComponentUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class SetComponent<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new SetComponent.
   *
   * @tags SetComponent
   * @name CreateCreate
   * @summary Create a new SetComponent.
   * @request POST:/set_component/create
   * @secure
   * @response `204` `void` SetComponent retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` SetComponent foreign key constraint not found
   */
  createCreate = (
    data: SetComponentCreateSchema,
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
      path: `/set_component/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a SetComponent.
   *
   * @tags SetComponent
   * @name DeleteStringObjectIdDelete
   * @summary Delete a SetComponent.
   * @request DELETE:/set_component/delete/{string:object_id}
   * @secure
   * @response `204` `void` SetComponent deleted successfully
   * @response `400` `void` SetComponent validation error
   * @response `404` `void` SetComponent not found
   */
  deleteStringObjectIdDelete = (objectId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set_component/delete/{string${objectId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific SetComponent for a user.
   *
   * @tags SetComponent
   * @name GetStringObjectIdList
   * @summary Get a specific SetComponent for a user.
   * @request GET:/set_component/get/{string:object_id}
   * @secure
   * @response `200` `SetComponentCreateSchema` SetComponent for user retrieved successfully
   * @response `404` `void` SetComponent not found
   */
  getStringObjectIdList = (objectId: string, params: RequestParams = {}) =>
    this.http.request<SetComponentCreateSchema, void>({
      path: `/set_component/get/{string${objectId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get SetComponent for a user based on query.
   *
   * @tags SetComponent
   * @name PostSetComponent
   * @summary Get SetComponent for a user based on query.
   * @request POST:/set_component/get
   * @secure
   * @response `204` `(SetComponentCreateSchema)[]` SetComponent for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postSetComponent = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<SetComponentCreateSchema[], void>({
      path: `/set_component/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a SetComponent for a user.
   *
   * @tags SetComponent
   * @name UpdateUpdate
   * @summary Update a SetComponent for a user.
   * @request PUT:/set_component/update
   * @secure
   * @response `201` `void` SetComponent updated successfully
   * @response `400` `void` SetComponent validation error
   * @response `404` `void` SetComponent not found or foreign key constraint not found
   */
  updateUpdate = (
    data: SetComponentUpdateSchema,
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
      path: `/set_component/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
