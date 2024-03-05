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
  PlanComponentCreateSchema,
  PlanComponentTreeCreateSchema,
  PlanComponentUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class PlanComponent<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new PlanComponent.
   *
   * @tags PlanComponent
   * @name CreateCreate
   * @summary Create a new PlanComponent.
   * @request POST:/plan_component/create
   * @secure
   * @response `204` `void` PlanComponent retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` PlanComponent foreign key constraint not found
   */
  createCreate = (
    data: PlanComponentCreateSchema,
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
      path: `/plan_component/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new PlanComponent and all it's child components.
   *
   * @tags PlanComponent
   * @name CreateTreeCreate
   * @summary Create a PlanComponent tree object.
   * @request POST:/plan_component/create/tree
   * @response `204` `void` PlanComponent tree created successfully
   * @response `400` `void` PlanComponent tree validation error
   */
  createTreeCreate = (
    data: PlanComponentTreeCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/plan_component/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a PlanComponent.
   *
   * @tags PlanComponent
   * @name DeleteStringPlanComponentIdDelete
   * @summary Delete a PlanComponent.
   * @request DELETE:/plan_component/delete/{string:plan_component_id}
   * @secure
   * @response `204` `void` PlanComponent deleted successfully
   * @response `400` `void` PlanComponent validation error
   * @response `404` `void` PlanComponent not found
   */
  deleteStringPlanComponentIdDelete = (
    planComponentId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/plan_component/delete/{string${planComponentId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific PlanComponent for a user.
   *
   * @tags PlanComponent
   * @name GetStringPlanComponentIdList
   * @summary Get a specific PlanComponent for a user.
   * @request GET:/plan_component/get/{string:plan_component_id}
   * @secure
   * @response `200` `PlanComponentCreateSchema` PlanComponent for user retrieved successfully
   * @response `404` `void` PlanComponent not found
   */
  getStringPlanComponentIdList = (
    planComponentId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<PlanComponentCreateSchema, void>({
      path: `/plan_component/get/{string${planComponentId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get PlanComponent for a user based on query.
   *
   * @tags PlanComponent
   * @name PostPlanComponent
   * @summary Get PlanComponent for a user based on query.
   * @request POST:/plan_component/get
   * @secure
   * @response `204` `(PlanComponentCreateSchema)[]` PlanComponent for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postPlanComponent = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<PlanComponentCreateSchema[], void>({
      path: `/plan_component/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a PlanComponent for a user.
   *
   * @tags PlanComponent
   * @name UpdateUpdate
   * @summary Update a PlanComponent for a user.
   * @request PUT:/plan_component/update
   * @secure
   * @response `201` `void` PlanComponent updated successfully
   * @response `400` `void` PlanComponent validation error
   * @response `404` `void` PlanComponent not found or foreign key constraint not found
   */
  updateUpdate = (
    data: PlanComponentUpdateSchema,
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
      path: `/plan_component/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
