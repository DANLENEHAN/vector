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
  ExerciseEquipmentCreateSchema,
  ExerciseEquipmentUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class ExerciseEquipment<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new ExerciseEquipment.
   *
   * @tags ExerciseEquipment
   * @name CreateCreate
   * @summary Create a new ExerciseEquipment.
   * @request POST:/exercise_equipment/create
   * @secure
   * @response `204` `void` ExerciseEquipment retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` ExerciseEquipment foreign key constraint not found
   */
  createCreate = (
    data: ExerciseEquipmentCreateSchema,
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
      path: `/exercise_equipment/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a ExerciseEquipment.
   *
   * @tags ExerciseEquipment
   * @name DeleteDelete
   * @summary Delete a ExerciseEquipment.
   * @request DELETE:/exercise_equipment/delete/{exercise_equipment_id}
   * @secure
   * @response `204` `void` ExerciseEquipment deleted successfully
   * @response `400` `void` ExerciseEquipment validation error
   * @response `404` `void` ExerciseEquipment not found
   */
  deleteDelete = (exerciseEquipmentId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise_equipment/delete/${exerciseEquipmentId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific ExerciseEquipment for a user.
   *
   * @tags ExerciseEquipment
   * @name GetExerciseEquipment
   * @summary Get a specific ExerciseEquipment for a user.
   * @request GET:/exercise_equipment/get/{exercise_equipment_id}
   * @secure
   * @response `200` `ExerciseEquipmentCreateSchema` ExerciseEquipment for user retrieved successfully
   * @response `404` `void` ExerciseEquipment not found
   */
  getExerciseEquipment = (
    exerciseEquipmentId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseEquipmentCreateSchema, void>({
      path: `/exercise_equipment/get/${exerciseEquipmentId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get ExerciseEquipment for a user based on query.
   *
   * @tags ExerciseEquipment
   * @name PostExerciseEquipment
   * @summary Get ExerciseEquipment for a user based on query.
   * @request POST:/exercise_equipment/get
   * @secure
   * @response `204` `(ExerciseEquipmentCreateSchema)[]` ExerciseEquipment for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postExerciseEquipment = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<ExerciseEquipmentCreateSchema[], void>({
      path: `/exercise_equipment/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a ExerciseEquipment for a user.
   *
   * @tags ExerciseEquipment
   * @name UpdateUpdate
   * @summary Update a ExerciseEquipment for a user.
   * @request PUT:/exercise_equipment/update
   * @secure
   * @response `201` `void` ExerciseEquipment updated successfully
   * @response `400` `void` ExerciseEquipment validation error
   * @response `404` `void` ExerciseEquipment not found or foreign key constraint not found
   */
  updateUpdate = (
    data: ExerciseEquipmentUpdateSchema,
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
      path: `/exercise_equipment/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
