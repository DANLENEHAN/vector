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
  WorkoutComponentGetSchema,
  WorkoutComponentTreeRootCreateSchema,
  WorkoutComponentUpdateSchema,
  WorkoutCreateSchema,
  WorkoutGetSchema,
  WorkoutTreeRootCreateSchema,
  WorkoutUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Workout<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new workout component.
   *
   * @tags Workout Component
   * @name ComponentCreateCreate
   * @summary Create a new workout component.
   * @request POST:/workout/component/create
   * @response `204` `void` Workout Component created successfully
   * @response `400` `void` Workout Component validation error
   */
  componentCreateCreate = (
    data: WorkoutComponentCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/workout/component/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new workout componet and all it's child components.
   *
   * @tags Workout Component
   * @name ComponentCreateTreeCreate
   * @summary Create the full workout component tree.
   * @request POST:/workout/component/create/tree
   * @response `204` `void` Workout Component created successfully
   * @response `400` `void` Workout Component validation error
   */
  componentCreateTreeCreate = (
    data: WorkoutComponentTreeRootCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/workout/component/create/tree`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a workout component
   *
   * @tags Workout Component
   * @name ComponentDeleteIntWorkoutComponentDelete
   * @summary Delete a workout component
   * @request DELETE:/workout/component/delete/{int:workout_component}
   * @response `204` `void` Workout Component deleted successfully
   * @response `400` `void` Workout Component ID is required to delete a workout component
   * @response `404` `void` Workout Component not found
   */
  componentDeleteIntWorkoutComponentDelete = (
    workoutComponentId: number,
    workoutComponent: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/workout/component/delete/{int${workoutComponent}}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get workout components from the database.
   *
   * @tags Workout Component
   * @name ComponentGetCreate
   * @summary Get workout components
   * @request POST:/workout/component/get
   * @secure
   * @response `204` `void` Workout components found successfully
   * @response `400` `void` Query validation error
   */
  componentGetCreate = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/workout/component/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get a workout component
   *
   * @tags Workout Component
   * @name ComponentGetIntWorkoutComponentIdList
   * @summary Get a workout component
   * @request GET:/workout/component/get/{int:workout_component_id}
   * @response `200` `WorkoutComponentGetSchema` Workout Component retrieved successfully
   */
  componentGetIntWorkoutComponentIdList = (
    workoutComponentId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<WorkoutComponentGetSchema, any>({
      path: `/workout/component/get/{int${workoutComponentId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Update a workout component
   *
   * @tags Workout Component
   * @name ComponentUpdateUpdate
   * @summary Update a workout component
   * @request PUT:/workout/component/update
   * @response `201` `WorkoutComponentGetSchema` Workout Component updated successfully
   * @response `400` `void` Workout Component ID is required to update a workout Component
   * @response `404` `void` Workout Component not found
   */
  componentUpdateUpdate = (
    data: WorkoutComponentUpdateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<WorkoutComponentGetSchema, void>({
      path: `/workout/component/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create a new workout.
   *
   * @tags Workout
   * @name CreateCreate
   * @summary Create a new workout.
   * @request POST:/workout/create
   * @response `204` `void` Workout created successfully
   * @response `400` `void` Workout validation error
   */
  createCreate = (data: WorkoutCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/workout/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Create a new workout and all it's child components.
   *
   * @tags Workout
   * @name CreateTreeCreate
   * @summary Create a full workout tree.
   * @request POST:/workout/create/tree
   * @response `204` `void` Workout created successfully
   * @response `400` `void` Workout validation error
   */
  createTreeCreate = (
    data: WorkoutTreeRootCreateSchema,
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
   * @description Delete a workout
   *
   * @tags Workout
   * @name DeleteIntWorkoutIdDelete
   * @summary Delete a workout
   * @request DELETE:/workout/delete/{int:workout_id}
   * @response `204` `void` Workout deleted successfully
   * @response `400` `void` Workout ID is required to delete a workout
   * @response `404` `void` Workout not found
   */
  deleteIntWorkoutIdDelete = (
    workoutId: string,
    query: {
      /** ID of the workout to delete from the database */
      workout_id: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/workout/delete/{int${workoutId}}`,
      method: 'DELETE',
      query: query,
      ...params,
    });
  /**
   * @description Get a workout
   *
   * @tags Workout
   * @name GetIntWorkoutIdList
   * @summary Get a workout
   * @request GET:/workout/get/{int:workout_id}
   * @response `200` `WorkoutGetSchema` Workout retrieved successfully
   */
  getIntWorkoutIdList = (workoutId: number, params: RequestParams = {}) =>
    this.http.request<WorkoutGetSchema, any>({
      path: `/workout/get/{int${workoutId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get workouts from the database
   *
   * @tags Workout
   * @name PostWorkout
   * @summary Get workouts
   * @request POST:/workout/get
   * @secure
   * @response `204` `void` Workouts found successfully
   * @response `400` `void` Query validation error
   */
  postWorkout = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/workout/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update a workout
   *
   * @tags Workout
   * @name UpdateUpdate
   * @summary Update a workout
   * @request PUT:/workout/update
   * @response `201` `WorkoutGetSchema` Workout updated successfully
   * @response `400` `void` Workout validation error
   * @response `404` `void` Workout not found
   */
  updateUpdate = (data: WorkoutUpdateSchema, params: RequestParams = {}) =>
    this.http.request<WorkoutGetSchema, void>({
      path: `/workout/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
