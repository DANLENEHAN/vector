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
  ExerciseEquipmentGetSchema,
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
   * @description Create a new exercise_equipment.
   *
   * @tags ExerciseEquipment
   * @name CreateCreate
   * @summary Create a new exercise_equipment.
   * @request POST:/exercise_equipment/create
   * @response `204` `void` ExerciseEquipment created successfully
   * @response `400` `void` ExerciseEquipment validation error
   */
  createCreate = (
    data: ExerciseEquipmentCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/exercise_equipment/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete an exercise_equipment
   *
   * @tags ExerciseEquipment
   * @name DeleteDelete
   * @summary Delete an exercise_equipment
   * @request DELETE:/exercise_equipment/delete/{exercise_equipment_id}
   * @response `204` `void` ExerciseEquipment deleted successfully
   * @response `400` `void` ExerciseEquipment ID is required to delete an exercise_equipment
   * @response `404` `void` ExerciseEquipment not found
   */
  deleteDelete = (exerciseEquipmentId: number, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise_equipment/delete/${exerciseEquipmentId}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get an exercise_equipment
   *
   * @tags ExerciseEquipment
   * @name GetExerciseEquipment
   * @summary Get an exercise_equipment
   * @request GET:/exercise_equipment/get/{exercise_equipment_id}
   * @response `200` `ExerciseEquipmentGetSchema` ExerciseEquipment retrieved successfully
   */
  getExerciseEquipment = (
    exerciseEquipmentId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseEquipmentGetSchema, any>({
      path: `/exercise_equipment/get/${exerciseEquipmentId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get exercise equipments from the database
   *
   * @tags ExerciseEquipment
   * @name PostExerciseEquipment
   * @summary Get exercise equipments
   * @request POST:/exercise_equipment/get
   * @secure
   * @response `204` `void` Exercise equipment found successfully
   * @response `400` `void` Query validation error
   */
  postExerciseEquipment = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/exercise_equipment/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update an exercise_equipment
   *
   * @tags ExerciseEquipment
   * @name UpdateUpdate
   * @summary Update an exercise_equipment
   * @request PUT:/exercise_equipment/update
   * @response `201` `ExerciseEquipmentGetSchema` ExerciseEquipment updated successfully
   * @response `400` `void` ExerciseEquipment validation error
   * @response `404` `void` ExerciseEquipment not found
   */
  updateUpdate = (
    data: ExerciseEquipmentUpdateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<ExerciseEquipmentGetSchema, void>({
      path: `/exercise_equipment/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
