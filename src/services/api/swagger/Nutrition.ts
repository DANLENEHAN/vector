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
  NutritionCreateSchema,
  NutritionUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Nutrition<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new nutrition entry.
   *
   * @tags Nutrition
   * @name CreateCreate
   * @summary Create a new nutrition entry.
   * @request POST:/nutrition/create
   * @secure
   * @response `204` `void` Nutrition entry created successfully
   * @response `400` `void` Query parameter validation error
   */
  createCreate = (
    data: NutritionCreateSchema,
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
      path: `/nutrition/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a nutrition entry.
   *
   * @tags Nutrition
   * @name DeleteStringNutritionIdDelete
   * @summary Delete a nutrition entry.
   * @request DELETE:/nutrition/delete/{string:nutrition_id}
   * @secure
   * @response `204` `void` Nutrition deleted successfully
   * @response `400` `void` Nutrition ID is required to delete a nutrition entry
   * @response `404` `void` Nutrition not found
   */
  deleteStringNutritionIdDelete = (
    nutritionId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/nutrition/delete/{string${nutritionId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get a nutrition entry.
   *
   * @tags Nutrition
   * @name GetStringNutritionIdList
   * @summary Get a nutrition entry.
   * @request GET:/nutrition/get/{string:nutrition_id}
   * @secure
   * @response `200` `NutritionCreateSchema` Nutrition for user retrieved successfully
   * @response `404` `void` Nutrition not found
   */
  getStringNutritionIdList = (
    nutritionId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<NutritionCreateSchema, void>({
      path: `/nutrition/get/{string${nutritionId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all nutritions for a user.
   *
   * @tags Nutrition
   * @name PostNutrition
   * @summary Get all nutritions for a user.
   * @request POST:/nutrition/get
   * @secure
   * @response `204` `(NutritionCreateSchema)[]` Nutrition entries found successfully
   * @response `400` `void` Query validation error
   */
  postNutrition = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<NutritionCreateSchema[], void>({
      path: `/nutrition/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a nutrition entry.
   *
   * @tags Nutrition
   * @name UpdateUpdate
   * @summary Update a nutrition entry.
   * @request PUT:/nutrition/update
   * @secure
   * @response `201` `void` Nutrition updated successfully
   * @response `400` `void` Nutrition validation error
   * @response `404` `void` Nutrition not found
   */
  updateUpdate = (
    data: NutritionUpdateSchema,
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
      path: `/nutrition/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
