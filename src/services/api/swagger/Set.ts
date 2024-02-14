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
  SetCreateSchema,
  SetTreeCreateSchema,
  SetUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Set<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new Set.
   *
   * @tags Set
   * @name CreateCreate
   * @summary Create a new Set.
   * @request POST:/set/create
   * @secure
   * @response `204` `void` Set retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Set foreign key constraint not found
   */
  createCreate = (
    data: SetCreateSchema,
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
      path: `/set/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new Set and all it's child components.
   *
   * @tags Set
   * @name CreateTreeCreate
   * @summary Create a Set tree object.
   * @request POST:/set/create/tree
   * @response `204` `void` Set tree created successfully
   * @response `400` `void` Set tree validation error
   */
  createTreeCreate = (data: SetTreeCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Set.
   *
   * @tags Set
   * @name DeleteStringObjectIdDelete
   * @summary Delete a Set.
   * @request DELETE:/set/delete/{string:object_id}
   * @secure
   * @response `204` `void` Set deleted successfully
   * @response `400` `void` Set validation error
   * @response `404` `void` Set not found
   */
  deleteStringObjectIdDelete = (objectId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set/delete/{string${objectId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Set for a user.
   *
   * @tags Set
   * @name GetStringObjectIdList
   * @summary Get a specific Set for a user.
   * @request GET:/set/get/{string:object_id}
   * @secure
   * @response `200` `SetCreateSchema` Set for user retrieved successfully
   * @response `404` `void` Set not found
   */
  getStringObjectIdList = (objectId: string, params: RequestParams = {}) =>
    this.http.request<SetCreateSchema, void>({
      path: `/set/get/{string${objectId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Set for a user based on query.
   *
   * @tags Set
   * @name PostSet
   * @summary Get Set for a user based on query.
   * @request POST:/set/get
   * @secure
   * @response `204` `(SetCreateSchema)[]` Set for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postSet = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<SetCreateSchema[], void>({
      path: `/set/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Set for a user.
   *
   * @tags Set
   * @name UpdateUpdate
   * @summary Update a Set for a user.
   * @request PUT:/set/update
   * @secure
   * @response `201` `void` Set updated successfully
   * @response `400` `void` Set validation error
   * @response `404` `void` Set not found or foreign key constraint not found
   */
  updateUpdate = (
    data: SetUpdateSchema,
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
      path: `/set/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
