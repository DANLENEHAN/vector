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
  ExerciseBodypartGetSchema,
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
   * @description Create a new exercise_bodypart.
   *
   * @tags ExerciseBodypart
   * @name CreateCreate
   * @summary Create a new exercise_bodypart.
   * @request POST:/exercise_bodypart/create
   * @response `204` `void` ExerciseBodypart created successfully
   * @response `400` `void` ExerciseBodypart validation error
   */
  createCreate = (
    data: ExerciseBodypartCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/exercise_bodypart/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete an exercise_bodypart
   *
   * @tags ExerciseBodypart
   * @name DeleteIntExerciseBodypartIdDelete
   * @summary Delete an exercise_bodypart
   * @request DELETE:/exercise_bodypart/delete/{int:exercise_bodypart_id}
   * @response `204` `void` ExerciseBodypart deleted successfully
   * @response `400` `void` ExerciseBodypart ID is required to delete an exercise_bodypart
   * @response `404` `void` ExerciseBodypart not found
   */
  deleteIntExerciseBodypartIdDelete = (
    exerciseBodypartId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/exercise_bodypart/delete/{int${exerciseBodypartId}}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get an exercise_bodypart
   *
   * @tags ExerciseBodypart
   * @name GetIntExerciseBodypartIdList
   * @summary Get an exercise_bodypart
   * @request GET:/exercise_bodypart/get/{int:exercise_bodypart_id}
   * @response `200` `ExerciseBodypartGetSchema` ExerciseBodypart retrieved successfully
   */
  getIntExerciseBodypartIdList = (
    exerciseBodypartId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseBodypartGetSchema, any>({
      path: `/exercise_bodypart/get/{int${exerciseBodypartId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get exercise bodyparts from the database
   *
   * @tags ExerciseBodypart
   * @name PostExerciseBodypart
   * @summary Get exercise bodypart
   * @request POST:/exercise_bodypart/get
   * @secure
   * @response `204` `void` Exercise bodypart found successfully
   * @response `400` `void` Query validation error
   */
  postExerciseBodypart = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise_bodypart/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update an exercise_bodypart
   *
   * @tags ExerciseBodypart
   * @name UpdateUpdate
   * @summary Update an exercise_bodypart
   * @request PUT:/exercise_bodypart/update
   * @response `201` `ExerciseBodypartGetSchema` ExerciseBodypart updated successfully
   * @response `400` `void` ExerciseBodypart validation error
   * @response `404` `void` ExerciseBodypart not found
   */
  updateUpdate = (
    data: ExerciseBodypartUpdateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseBodypartGetSchema, void>({
      path: `/exercise_bodypart/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
