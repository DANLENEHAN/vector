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
  PlanComponentGetSchema,
  PlanComponentQuerySchema,
  PlanComponentUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class PlanComponent<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a plan_component
   *
   * @tags Plan Component
   * @name CreateCreate
   * @summary Create a plan_component
   * @request POST:/plan_component/create
   * @response `201` `void` Plan created successfully
   * @response `400` `void` Plan validation error
   */
  createCreate = (
    data: PlanComponentCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/plan_component/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a plan_component
   *
   * @tags Plan Component
   * @name DeleteDelete
   * @summary Delete a plan_component
   * @request DELETE:/plan_component/delete/{plan_component_id}
   * @response `204` `void` Plan Component deleted successfully
   * @response `400` `void` Plan Component ID is required to delete a plan_component
   * @response `404` `void` Plan Component not found
   */
  deleteDelete = (planComponentId: number, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/plan_component/delete/${planComponentId}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get a plan_component
   *
   * @tags Plan Component
   * @name GetPlanComponent
   * @summary Get a plan_component
   * @request GET:/plan_component/get/{plan_component_id}
   * @response `200` `PlanComponentGetSchema` Plan Component retrieved successfully
   * @response `404` `void` Plan Component not found
   */
  getPlanComponent = (planComponentId: number, params: RequestParams = {}) =>
    this.http.request<PlanComponentGetSchema, void>({
      path: `/plan_component/get/${planComponentId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get plan components from the database
   *
   * @tags Plan Component
   * @name PostPlanComponent
   * @summary Get plan components
   * @request POST:/plan_component/get
   * @secure
   * @response `204` `void` Plan Component found successfully
   * @response `400` `void` Query validation error
   */
  postPlanComponent = (
    data: PlanComponentQuerySchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/plan_component/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update a plan_component
   *
   * @tags Plan Component
   * @name UpdateUpdate
   * @summary Update a plan_component
   * @request PUT:/plan_component/update
   * @response `201` `PlanComponentGetSchema` Plan Component updated successfully
   * @response `400` `void` Plan Component validation error
   * @response `404` `void` Plan Component not found
   */
  updateUpdate = (
    data: PlanComponentUpdateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<PlanComponentGetSchema, void>({
      path: `/plan_component/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
