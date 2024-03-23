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

export class SpecificMuscle<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Get a specific_muscle
   *
   * @tags SpecificMuscleGetSchema
   * @name GetSpecificMuscle
   * @summary Get a specific_muscle
   * @request GET:/specific_muscle/get/{specific_muscle_id}
   * @response `200` `any` SpecificMuscleGetSchema retrieved successfully
   */
  getSpecificMuscle = (specificMuscleId: number, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/specific_muscle/get/${specificMuscleId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get specific_muscles from the database
   *
   * @tags SpecificMuscleGetSchema
   * @name PostSpecificMuscle
   * @summary Get specific_muscles
   * @request POST:/specific_muscle/get
   * @secure
   * @response `204` `void` SpecificMuscleGetSchemas found successfully
   * @response `400` `void` Query validation error
   */
  postSpecificMuscle = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/specific_muscle/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
