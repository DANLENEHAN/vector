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
  ExerciseGetSchema,
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
   * @description Create a new exercise.
   *
   * @tags Exercise
   * @name CreateCreate
   * @summary Create a new exercise.
   * @request POST:/exercise/create
   * @response `204` `void` Exercise created successfully
   * @response `400` `void` Exercise validation error
   */
  createCreate = (data: ExerciseCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete an exercise
   *
   * @tags Exercise
   * @name DeleteDelete
   * @summary Delete an exercise
   * @request DELETE:/exercise/delete/{exercise_id}
   * @response `204` `void` Exercise deleted successfully
   * @response `400` `void` Exercise ID is required to delete an exercise
   * @response `404` `void` Exercise not found
   */
  deleteDelete = (exerciseId: number, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise/delete/${exerciseId}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get an exercise
   *
   * @tags Exercise
   * @name GetExercise
   * @summary Get an exercise
   * @request GET:/exercise/get/{exercise_id}
   * @response `200` `ExerciseGetSchema` Exercise retrieved successfully
   */
  getExercise = (exerciseId: number, params: RequestParams = {}) =>
    this.http.request<ExerciseGetSchema, any>({
      path: `/exercise/get/${exerciseId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get exercises from the database
   *
   * @tags Exercise
   * @name PostExercise
   * @summary Get exercises
   * @request POST:/exercise/get
   * @secure
   * @response `204` `void` Exercise found successfully
   * @response `400` `void` Query validation error
   */
  postExercise = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update an exercise
   *
   * @tags Exercise
   * @name UpdateUpdate
   * @summary Update an exercise
   * @request PUT:/exercise/update
   * @response `201` `ExerciseGetSchema` Exercise updated successfully
   * @response `400` `void` Exercise validation error
   * @response `404` `void` Exercise not found
   */
  updateUpdate = (data: ExerciseUpdateSchema, params: RequestParams = {}) =>
    this.http.request<ExerciseGetSchema, void>({
      path: `/exercise/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
