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
   * @description Create a new Plan.
   *
   * @tags Plan
   * @name CreateCreate
   * @summary Create a new Plan.
   * @request POST:/plan/create
   * @secure
   * @response `204` `void` Plan retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Plan foreign key constraint not found
   */
  createCreate = (
    data: PlanCreateSchema,
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
      path: `/plan/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new Plan and all it's child components.
   *
   * @tags Plan
   * @name CreateTreeCreate
   * @summary Create a Plan tree object.
   * @request POST:/plan/create/tree
   * @response `204` `void` Plan tree created successfully
   * @response `400` `void` Plan tree validation error
   */
  createTreeCreate = (data: any, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/plan/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Plan.
   *
   * @tags Plan
   * @name DeleteStringObjectIdDelete
   * @summary Delete a Plan.
   * @request DELETE:/plan/delete/{string:object_id}
   * @secure
   * @response `204` `void` Plan deleted successfully
   * @response `400` `void` Plan validation error
   * @response `404` `void` Plan not found
   */
  deleteStringObjectIdDelete = (objectId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/plan/delete/{string${objectId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Plan for a user.
   *
   * @tags Plan
   * @name GetStringObjectIdList
   * @summary Get a specific Plan for a user.
   * @request GET:/plan/get/{string:object_id}
   * @secure
   * @response `200` `PlanCreateSchema` Plan for user retrieved successfully
   * @response `404` `void` Plan not found
   */
  getStringObjectIdList = (objectId: string, params: RequestParams = {}) =>
    this.http.request<PlanCreateSchema, void>({
      path: `/plan/get/{string${objectId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Plan for a user based on query.
   *
   * @tags Plan
   * @name PostPlan
   * @summary Get Plan for a user based on query.
   * @request POST:/plan/get
   * @secure
   * @response `204` `(PlanCreateSchema)[]` Plan for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postPlan = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<PlanCreateSchema[], void>({
      path: `/plan/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Plan for a user.
   *
   * @tags Plan
   * @name UpdateUpdate
   * @summary Update a Plan for a user.
   * @request PUT:/plan/update
   * @secure
   * @response `201` `void` Plan updated successfully
   * @response `400` `void` Plan validation error
   * @response `404` `void` Plan not found or foreign key constraint not found
   */
  updateUpdate = (
    data: PlanUpdateSchema,
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
      path: `/plan/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
