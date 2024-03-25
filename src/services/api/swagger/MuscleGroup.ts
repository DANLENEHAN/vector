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

import {QuerySchema} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class MuscleGroup<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Get a muscle_group
   *
   * @tags MuscleGroup
   * @name GetMuscleGroup
   * @summary Get a muscle_group
   * @request GET:/muscle_group/get/{muscle_group_id}
   * @response `200` `any` MuscleGroup retrieved successfully
   */
  getMuscleGroup = (muscleGroupId: number, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/muscle_group/get/${muscleGroupId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get muscle_groups from the database
   *
   * @tags MuscleGroup
   * @name PostMuscleGroup
   * @summary Get muscle_groups
   * @request POST:/muscle_group/get
   * @secure
   * @response `204` `void` Bodyparts found successfully
   * @response `400` `void` Query validation error
   */
  postMuscleGroup = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/muscle_group/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
