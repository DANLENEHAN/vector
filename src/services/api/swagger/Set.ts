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
  SetComponentGetSchema,
  SetComponentUpdateSchema,
  SetCreateSchema,
  SetGetSchema,
  SetTreeRootCreateSchema,
  SetUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Set<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new set component.
   *
   * @tags Set Component
   * @name ComponentCreateCreate
   * @summary Create a new set component.
   * @request POST:/set/component/create
   * @response `204` `void` Set Component created successfully
   * @response `400` `void` Set Component validation error
   */
  componentCreateCreate = (
    data: SetComponentCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/set/component/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a set component
   *
   * @tags Set Component
   * @name ComponentDeleteIntSetComponentIdDelete
   * @summary Delete a set component
   * @request DELETE:/set/component/delete/{int:set_component_id}
   * @response `204` `void` Set Component deleted successfully
   * @response `400` `void` Set Component ID is required to delete a set component
   * @response `404` `void` Set Component not found
   */
  componentDeleteIntSetComponentIdDelete = (
    setComponentId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/set/component/delete/{int${setComponentId}}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get set components from the database
   *
   * @tags Set Component
   * @name ComponentGetCreate
   * @summary Get set components
   * @request POST:/set/component/get
   * @secure
   * @response `204` `void` Set Component found successfully
   * @response `400` `void` Query validation error
   */
  componentGetCreate = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set/component/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get a set component
   *
   * @tags Set Component
   * @name ComponentGetIntSetComponentIdList
   * @summary Get a set component
   * @request GET:/set/component/get/{int:set_component_id}
   * @response `200` `SetComponentGetSchema` Set Component retrieved successfully
   */
  componentGetIntSetComponentIdList = (
    setComponentId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<SetComponentGetSchema, any>({
      path: `/set/component/get/{int${setComponentId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Update a set component
   *
   * @tags Set Component
   * @name ComponentUpdateUpdate
   * @summary Update a set component
   * @request PUT:/set/component/update
   * @response `201` `SetComponentGetSchema` Set Component updated successfully
   * @response `400` `void` Set Component ID is required to update a set Component
   * @response `404` `void` Set Component not found
   */
  componentUpdateUpdate = (
    data: SetComponentUpdateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<SetComponentGetSchema, void>({
      path: `/set/component/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create a set
   *
   * @tags Set
   * @name CreateCreate
   * @summary Create a set
   * @request POST:/set/create
   * @response `201` `void` Set created successfully
   * @response `400` `void` Set validation error
   */
  createCreate = (data: SetCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new set and all it's child components.
   *
   * @tags Set
   * @name CreateTreeCreate
   * @summary Create a full set tree.
   * @request POST:/set/create/tree
   * @response `204` `void` Set created successfully
   * @response `400` `void` Set validation error
   */
  createTreeCreate = (
    data: SetTreeRootCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/set/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a set
   *
   * @tags Set
   * @name DeleteIntSetIdDelete
   * @summary Delete a set
   * @request DELETE:/set/delete/{int:set_id}
   * @response `204` `void` Set deleted successfully
   * @response `400` `void` Set ID is required to delete a set
   * @response `404` `void` Set not found
   */
  deleteIntSetIdDelete = (setId?: number, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set/delete/{int${setId}}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get a set
   *
   * @tags Set
   * @name GetIntSetIdList
   * @summary Get a set
   * @request GET:/set/get/{int:set_id}
   * @response `200` `SetGetSchema` Set retrieved successfully
   * @response `404` `void` Set not found
   */
  getIntSetIdList = (setId?: number, params: RequestParams = {}) =>
    this.http.request<SetGetSchema, void>({
      path: `/set/get/{int${setId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get set from the database
   *
   * @tags Set
   * @name PostSet
   * @summary Get sets
   * @request POST:/set/get
   * @secure
   * @response `204` `void` Set found successfully
   * @response `400` `void` Query validation error
   */
  postSet = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/set/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update a set
   *
   * @tags Set
   * @name UpdateUpdate
   * @summary Update a set
   * @request PUT:/set/update
   * @response `201` `SetGetSchema` Set updated successfully
   * @response `400` `void` Set validation error
   * @response `404` `void` Set not found
   */
  updateUpdate = (data: SetUpdateSchema, params: RequestParams = {}) =>
    this.http.request<SetGetSchema, void>({
      path: `/set/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
