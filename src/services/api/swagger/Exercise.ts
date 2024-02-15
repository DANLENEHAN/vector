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
   * @name DeleteStringExerciseIdDelete
   * @summary Delete a Exercise.
   * @request DELETE:/exercise/delete/{string:exercise_id}
   * @secure
   * @response `204` `void` Exercise deleted successfully
   * @response `400` `void` Exercise validation error
   * @response `404` `void` Exercise not found
   */
  deleteStringExerciseIdDelete = (
    exerciseId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/exercise/delete/{string${exerciseId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Exercise for a user.
   *
   * @tags Exercise
   * @name GetStringExerciseIdList
   * @summary Get a specific Exercise for a user.
   * @request GET:/exercise/get/{string:exercise_id}
   * @secure
   * @response `200` `ExerciseCreateSchema` Exercise for user retrieved successfully
   * @response `404` `void` Exercise not found
   */
  getStringExerciseIdList = (exerciseId: string, params: RequestParams = {}) =>
    this.http.request<ExerciseCreateSchema, void>({
      path: `/exercise/get/{string${exerciseId}}`,
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
