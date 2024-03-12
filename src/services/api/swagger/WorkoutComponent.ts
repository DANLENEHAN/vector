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
  WorkoutComponentCreateSchema,
  WorkoutComponentTreeCreateSchema,
  WorkoutComponentUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class WorkoutComponent<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new WorkoutComponent.
   *
   * @tags WorkoutComponent
   * @name CreateCreate
   * @summary Create a new WorkoutComponent.
   * @request POST:/workout_component/create
   * @secure
   * @response `204` `void` WorkoutComponent retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` WorkoutComponent foreign key constraint not found
   */
  createCreate = (
    data: WorkoutComponentCreateSchema,
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
      path: `/workout_component/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new WorkoutComponent and all it's child components.
   *
   * @tags WorkoutComponent
   * @name CreateTreeCreate
   * @summary Create a WorkoutComponent tree object.
   * @request POST:/workout_component/create/tree
   * @response `204` `void` WorkoutComponent tree created successfully
   * @response `400` `void` WorkoutComponent tree validation error
   */
  createTreeCreate = (
    data: WorkoutComponentTreeCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/workout_component/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a WorkoutComponent.
   *
   * @tags WorkoutComponent
   * @name DeleteDelete
   * @summary Delete a WorkoutComponent.
   * @request DELETE:/workout_component/delete/{workout_component_id}
   * @secure
   * @response `204` `void` WorkoutComponent deleted successfully
   * @response `400` `void` WorkoutComponent validation error
   * @response `404` `void` WorkoutComponent not found
   */
  deleteDelete = (workoutComponentId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/workout_component/delete/${workoutComponentId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific WorkoutComponent for a user.
   *
   * @tags WorkoutComponent
   * @name GetWorkoutComponent
   * @summary Get a specific WorkoutComponent for a user.
   * @request GET:/workout_component/get/{workout_component_id}
   * @secure
   * @response `200` `WorkoutComponentCreateSchema` WorkoutComponent for user retrieved successfully
   * @response `404` `void` WorkoutComponent not found
   */
  getWorkoutComponent = (
    workoutComponentId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<WorkoutComponentCreateSchema, void>({
      path: `/workout_component/get/${workoutComponentId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get WorkoutComponent for a user based on query.
   *
   * @tags WorkoutComponent
   * @name PostWorkoutComponent
   * @summary Get WorkoutComponent for a user based on query.
   * @request POST:/workout_component/get
   * @secure
   * @response `204` `(WorkoutComponentCreateSchema)[]` WorkoutComponent for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postWorkoutComponent = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<WorkoutComponentCreateSchema[], void>({
      path: `/workout_component/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a WorkoutComponent for a user.
   *
   * @tags WorkoutComponent
   * @name UpdateUpdate
   * @summary Update a WorkoutComponent for a user.
   * @request PUT:/workout_component/update
   * @secure
   * @response `201` `void` WorkoutComponent updated successfully
   * @response `400` `void` WorkoutComponent validation error
   * @response `404` `void` WorkoutComponent not found or foreign key constraint not found
   */
  updateUpdate = (
    data: WorkoutComponentUpdateSchema,
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
      path: `/workout_component/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
