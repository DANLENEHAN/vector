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
  ExerciseBodypartCreateSchema,
  ExerciseBodypartUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class ExerciseBodypart<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new ExerciseBodypart.
   *
   * @tags ExerciseBodypart
   * @name CreateCreate
   * @summary Create a new ExerciseBodypart.
   * @request POST:/exercise_bodypart/create
   * @secure
   * @response `204` `void` ExerciseBodypart retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` ExerciseBodypart foreign key constraint not found
   */
  createCreate = (
    data: ExerciseBodypartCreateSchema,
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
      path: `/exercise_bodypart/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a ExerciseBodypart.
   *
   * @tags ExerciseBodypart
   * @name DeleteDelete
   * @summary Delete a ExerciseBodypart.
   * @request DELETE:/exercise_bodypart/delete/{exercise_bodypart_id}
   * @secure
   * @response `204` `void` ExerciseBodypart deleted successfully
   * @response `400` `void` ExerciseBodypart validation error
   * @response `404` `void` ExerciseBodypart not found
   */
  deleteDelete = (exerciseBodypartId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise_bodypart/delete/${exerciseBodypartId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific ExerciseBodypart for a user.
   *
   * @tags ExerciseBodypart
   * @name GetExerciseBodypart
   * @summary Get a specific ExerciseBodypart for a user.
   * @request GET:/exercise_bodypart/get/{exercise_bodypart_id}
   * @secure
   * @response `200` `ExerciseBodypartCreateSchema` ExerciseBodypart for user retrieved successfully
   * @response `404` `void` ExerciseBodypart not found
   */
  getExerciseBodypart = (
    exerciseBodypartId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseBodypartCreateSchema, void>({
      path: `/exercise_bodypart/get/${exerciseBodypartId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get ExerciseBodypart for a user based on query.
   *
   * @tags ExerciseBodypart
   * @name PostExerciseBodypart
   * @summary Get ExerciseBodypart for a user based on query.
   * @request POST:/exercise_bodypart/get
   * @secure
   * @response `204` `(ExerciseBodypartCreateSchema)[]` ExerciseBodypart for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postExerciseBodypart = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<ExerciseBodypartCreateSchema[], void>({
      path: `/exercise_bodypart/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a ExerciseBodypart for a user.
   *
   * @tags ExerciseBodypart
   * @name UpdateUpdate
   * @summary Update a ExerciseBodypart for a user.
   * @request PUT:/exercise_bodypart/update
   * @secure
   * @response `201` `void` ExerciseBodypart updated successfully
   * @response `400` `void` ExerciseBodypart validation error
   * @response `404` `void` ExerciseBodypart not found or foreign key constraint not found
   */
  updateUpdate = (
    data: ExerciseBodypartUpdateSchema,
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
      path: `/exercise_bodypart/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
