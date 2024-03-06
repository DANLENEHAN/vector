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
  WorkoutCreateSchema,
  WorkoutTreeCreateSchema,
  WorkoutUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Workout<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new Workout.
   *
   * @tags Workout
   * @name CreateCreate
   * @summary Create a new Workout.
   * @request POST:/workout/create
   * @secure
   * @response `204` `void` Workout retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Workout foreign key constraint not found
   */
  createCreate = (
    data: WorkoutCreateSchema,
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
      path: `/workout/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new Workout and all it's child components.
   *
   * @tags Workout
   * @name CreateTreeCreate
   * @summary Create a Workout tree object.
   * @request POST:/workout/create/tree
   * @response `204` `void` Workout tree created successfully
   * @response `400` `void` Workout tree validation error
   */
  createTreeCreate = (
    data: WorkoutTreeCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/workout/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Workout.
   *
   * @tags Workout
   * @name DeleteDelete
   * @summary Delete a Workout.
   * @request DELETE:/workout/delete/{workout_id}
   * @secure
   * @response `204` `void` Workout deleted successfully
   * @response `400` `void` Workout validation error
   * @response `404` `void` Workout not found
   */
  deleteDelete = (workoutId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/workout/delete/${workoutId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Workout for a user.
   *
   * @tags Workout
   * @name GetWorkout
   * @summary Get a specific Workout for a user.
   * @request GET:/workout/get/{workout_id}
   * @secure
   * @response `200` `WorkoutCreateSchema` Workout for user retrieved successfully
   * @response `404` `void` Workout not found
   */
  getWorkout = (workoutId: string, params: RequestParams = {}) =>
    this.http.request<WorkoutCreateSchema, void>({
      path: `/workout/get/${workoutId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Workout for a user based on query.
   *
   * @tags Workout
   * @name PostWorkout
   * @summary Get Workout for a user based on query.
   * @request POST:/workout/get
   * @secure
   * @response `204` `(WorkoutCreateSchema)[]` Workout for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postWorkout = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<WorkoutCreateSchema[], void>({
      path: `/workout/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Workout for a user.
   *
   * @tags Workout
   * @name UpdateUpdate
   * @summary Update a Workout for a user.
   * @request PUT:/workout/update
   * @secure
   * @response `201` `void` Workout updated successfully
   * @response `400` `void` Workout validation error
   * @response `404` `void` Workout not found or foreign key constraint not found
   */
  updateUpdate = (
    data: WorkoutUpdateSchema,
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
      path: `/workout/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
