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

import {QuerySchema, SubMuscleGroupGetSchema} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class SubMuscleGroup<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Get a sub_muscle_group
   *
   * @tags SubMuscleGroup
   * @name GetSubMuscleGroup
   * @summary Get a sub_muscle_group
   * @request GET:/sub_muscle_group/get/{sub_muscle_group_id}
   * @response `200` `SubMuscleGroupGetSchema` SubMuscleGroup retrieved successfully
   */
  getSubMuscleGroup = (subMuscleGroupId: number, params: RequestParams = {}) =>
    this.http.request<SubMuscleGroupGetSchema, any>({
      path: `/sub_muscle_group/get/${subMuscleGroupId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get sub_muscle_groups from the database
   *
   * @tags SubMuscleGroup
   * @name PostSubMuscleGroup
   * @summary Get sub_muscle_groups
   * @request POST:/sub_muscle_group/get
   * @secure
   * @response `204` `void` SubMuscleGroups found successfully
   * @response `400` `void` Query validation error
   */
  postSubMuscleGroup = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/sub_muscle_group/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
