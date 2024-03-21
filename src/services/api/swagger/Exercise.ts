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
  ExerciseCreateSchema,
  ExerciseSearchResponse,
  ExerciseUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Exercise<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new Exercise.
   *
   * @tags Exercise
   * @name CreateCreate
   * @summary Create a new Exercise.
   * @request POST:/exercise/create
   * @secure
   * @response `204` `void` Exercise retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Exercise foreign key constraint not found
   */
  createCreate = (
    data: ExerciseCreateSchema,
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
      path: `/exercise/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a Exercise.
   *
   * @tags Exercise
   * @name DeleteDelete
   * @summary Delete a Exercise.
   * @request DELETE:/exercise/delete/{exercise_id}
   * @secure
   * @response `204` `void` Exercise deleted successfully
   * @response `400` `void` Exercise validation error
   * @response `404` `void` Exercise not found
   */
  deleteDelete = (exerciseId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise/delete/${exerciseId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Exercise for a user.
   *
   * @tags Exercise
   * @name GetExercise
   * @summary Get a specific Exercise for a user.
   * @request GET:/exercise/get/{exercise_id}
   * @secure
   * @response `200` `ExerciseCreateSchema` Exercise for user retrieved successfully
   * @response `404` `void` Exercise not found
   */
  getExercise = (exerciseId: string, params: RequestParams = {}) =>
    this.http.request<ExerciseCreateSchema, void>({
      path: `/exercise/get/${exerciseId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Exercise for a user based on query.
   *
   * @tags Exercise
   * @name PostExercise
   * @summary Get Exercise for a user based on query.
   * @request POST:/exercise/get
   * @secure
   * @response `204` `(ExerciseCreateSchema)[]` Exercise for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postExercise = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<ExerciseCreateSchema[], void>({
      path: `/exercise/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Performs a search on an exercise, returning the exercise, equipment, and bodyparts used.
   *
   * @tags Exercise
   * @name SearchCreate
   * @summary Perform an exercise search
   * @request POST:/exercise/search
   * @secure
   * @response `201` `ExerciseSearchResponse` Exercise request found results
   * @response `400` `void` Request is invalid
   */
  searchCreate = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<ExerciseSearchResponse, void>({
      path: `/exercise/search`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Exercise for a user.
   *
   * @tags Exercise
   * @name UpdateUpdate
   * @summary Update a Exercise for a user.
   * @request PUT:/exercise/update
   * @secure
   * @response `201` `void` Exercise updated successfully
   * @response `400` `void` Exercise validation error
   * @response `404` `void` Exercise not found or foreign key constraint not found
   */
  updateUpdate = (
    data: ExerciseUpdateSchema,
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
      path: `/exercise/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
