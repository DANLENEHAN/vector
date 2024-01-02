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
  PlanCreateSchema,
  PlanGetSchema,
  PlanUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Plan<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a plan
   *
   * @tags Plan
   * @name CreateCreate
   * @summary Create a plan
   * @request POST:/plan/create
   * @response `201` `void` Plan created successfully
   * @response `400` `void` Plan validation error
   */
  createCreate = (data: PlanCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/plan/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a plan
   *
   * @tags Plan
   * @name DeleteDelete
   * @summary Delete a plan
   * @request DELETE:/plan/delete/{plan_id}
   * @response `204` `void` Plan deleted successfully
   * @response `400` `void` Plan ID is required to delete a plan
   * @response `404` `void` Plan not found
   */
  deleteDelete = (planId: number, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/plan/delete/${planId}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get a plan
   *
   * @tags Plan
   * @name GetPlan
   * @summary Get a plan
   * @request GET:/plan/get/{plan_id}
   * @response `200` `PlanGetSchema` Plan retrieved successfully
   * @response `404` `void` Plan not found
   */
  getPlan = (planId: number, params: RequestParams = {}) =>
    this.http.request<PlanGetSchema, void>({
      path: `/plan/get/${planId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get plans from the database
   *
   * @tags Plan
   * @name PostPlan
   * @summary Get plans
   * @request POST:/plan/get
   * @secure
   * @response `204` `void` Plan found successfully
   * @response `400` `void` Query validation error
   */
  postPlan = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/plan/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update a plan
   *
   * @tags Plan
   * @name UpdateUpdate
   * @summary Update a plan
   * @request PUT:/plan/update
   * @response `201` `PlanGetSchema` Plan updated successfully
   * @response `400` `void` Plan validation error
   * @response `404` `void` Plan not found
   */
  updateUpdate = (data: PlanUpdateSchema, params: RequestParams = {}) =>
    this.http.request<PlanGetSchema, void>({
      path: `/plan/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
