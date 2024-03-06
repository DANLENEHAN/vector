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
   * @description Create a new Nutrition.
   *
   * @tags Nutrition
   * @name CreateCreate
   * @summary Create a new Nutrition.
   * @request POST:/nutrition/create
   * @secure
   * @response `204` `void` Nutrition retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` Nutrition foreign key constraint not found
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
   * @description Delete a Nutrition.
   *
   * @tags Nutrition
   * @name DeleteDelete
   * @summary Delete a Nutrition.
   * @request DELETE:/nutrition/delete/{nutrition_id}
   * @secure
   * @response `204` `void` Nutrition deleted successfully
   * @response `400` `void` Nutrition validation error
   * @response `404` `void` Nutrition not found
   */
  deleteDelete = (nutritionId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/nutrition/delete/${nutritionId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get specific Nutrition for a user.
   *
   * @tags Nutrition
   * @name GetNutrition
   * @summary Get a specific Nutrition for a user.
   * @request GET:/nutrition/get/{nutrition_id}
   * @secure
   * @response `200` `NutritionCreateSchema` Nutrition for user retrieved successfully
   * @response `404` `void` Nutrition not found
   */
  getNutrition = (nutritionId: string, params: RequestParams = {}) =>
    this.http.request<NutritionCreateSchema, void>({
      path: `/nutrition/get/${nutritionId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get Nutrition for a user based on query.
   *
   * @tags Nutrition
   * @name PostNutrition
   * @summary Get Nutrition for a user based on query.
   * @request POST:/nutrition/get
   * @secure
   * @response `204` `(NutritionCreateSchema)[]` Nutrition for user retrieved successfully
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
   * @description Update a Nutrition for a user.
   *
   * @tags Nutrition
   * @name UpdateUpdate
   * @summary Update a Nutrition for a user.
   * @request PUT:/nutrition/update
   * @secure
   * @response `201` `void` Nutrition updated successfully
   * @response `400` `void` Nutrition validation error
   * @response `404` `void` Nutrition not found or foreign key constraint not found
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
