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
  ExerciseSpecificMuscleCreateSchema,
  ExerciseSpecificMuscleUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class ExerciseSpecificMuscle<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new ExerciseSpecificMuscle.
   *
   * @tags ExerciseSpecificMuscle
   * @name CreateCreate
   * @summary Create a new ExerciseSpecificMuscle.
   * @request POST:/exercise_specific_muscle/create
   * @secure
   * @response `204` `void` ExerciseSpecificMuscle retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` ExerciseSpecificMuscle foreign key constraint not found
   */
  createCreate = (
    data: ExerciseSpecificMuscleCreateSchema,
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
      path: `/exercise_specific_muscle/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a ExerciseSpecificMuscle.
   *
   * @tags ExerciseSpecificMuscle
   * @name DeleteDelete
   * @summary Delete a ExerciseSpecificMuscle.
   * @request DELETE:/exercise_specific_muscle/delete/{exercise_specific_muscle_id}
   * @secure
   * @response `204` `void` ExerciseSpecificMuscle deleted successfully
   * @response `400` `void` ExerciseSpecificMuscle validation error
   * @response `404` `void` ExerciseSpecificMuscle not found
   */
  deleteDelete = (
    exerciseSpecificMuscleId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/exercise_specific_muscle/delete/${exerciseSpecificMuscleId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific ExerciseSpecificMuscle for a user.
   *
   * @tags ExerciseSpecificMuscle
   * @name GetExerciseSpecificMuscle
   * @summary Get a specific ExerciseSpecificMuscle for a user.
   * @request GET:/exercise_specific_muscle/get/{exercise_specific_muscle_id}
   * @secure
   * @response `200` `ExerciseSpecificMuscleCreateSchema` ExerciseSpecificMuscle for user retrieved successfully
   * @response `404` `void` ExerciseSpecificMuscle not found
   */
  getExerciseSpecificMuscle = (
    exerciseSpecificMuscleId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseSpecificMuscleCreateSchema, void>({
      path: `/exercise_specific_muscle/get/${exerciseSpecificMuscleId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get ExerciseSpecificMuscle for a user based on query.
   *
   * @tags ExerciseSpecificMuscle
   * @name PostExerciseSpecificMuscle
   * @summary Get ExerciseSpecificMuscle for a user based on query.
   * @request POST:/exercise_specific_muscle/get
   * @secure
   * @response `204` `(ExerciseSpecificMuscleCreateSchema)[]` ExerciseSpecificMuscle for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postExerciseSpecificMuscle = (
    data: QuerySchema,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseSpecificMuscleCreateSchema[], void>({
      path: `/exercise_specific_muscle/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a ExerciseSpecificMuscle for a user.
   *
   * @tags ExerciseSpecificMuscle
   * @name UpdateUpdate
   * @summary Update a ExerciseSpecificMuscle for a user.
   * @request PUT:/exercise_specific_muscle/update
   * @secure
   * @response `201` `void` ExerciseSpecificMuscle updated successfully
   * @response `400` `void` ExerciseSpecificMuscle validation error
   * @response `404` `void` ExerciseSpecificMuscle not found or foreign key constraint not found
   */
  updateUpdate = (
    data: ExerciseSpecificMuscleUpdateSchema,
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
      path: `/exercise_specific_muscle/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
