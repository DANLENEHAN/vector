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
  EquipmentCreateSchema,
  EquipmentGetSchema,
  EquipmentUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class Equipment<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new equipment.
   *
   * @tags Equipment
   * @name CreateCreate
   * @summary Create a new equipment.
   * @request POST:/equipment/create
   * @response `204` `void` Equipment created successfully
   * @response `400` `void` Equipment validation error
   */
  createCreate = (data: EquipmentCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/equipment/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete an equipment
   *
   * @tags Equipment
   * @name DeleteIntEquipmentIdDelete
   * @summary Delete an equipment
   * @request DELETE:/equipment/delete/{int:equipment_id}
   * @response `204` `void` Equipment deleted successfully
   * @response `400` `void` Equipment ID is required to delete an equipment
   * @response `404` `void` Equipment not found
   */
  deleteIntEquipmentIdDelete = (
    equipmentId: number,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/equipment/delete/{int${equipmentId}}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * @description Get an equipment
   *
   * @tags Equipment
   * @name GetIntEquipmentIdList
   * @summary Get an equipment
   * @request GET:/equipment/get/{int:equipment_id}
   * @response `200` `EquipmentGetSchema` Equipment retrieved successfully
   */
  getIntEquipmentIdList = (equipmentId: number, params: RequestParams = {}) =>
    this.http.request<EquipmentGetSchema, any>({
      path: `/equipment/get/{int${equipmentId}}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description Get equipment from the database
   *
   * @tags Equipment
   * @name PostEquipment
   * @summary Get equipment
   * @request POST:/equipment/get
   * @secure
   * @response `204` `void` Equipment found successfully
   * @response `400` `void` Query validation error
   */
  postEquipment = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/equipment/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update an equipment
   *
   * @tags Equipment
   * @name UpdateUpdate
   * @summary Update an equipment
   * @request PUT:/equipment/update
   * @response `201` `EquipmentGetSchema` Equipment updated successfully
   * @response `400` `void` Equipment validation error
   * @response `404` `void` Equipment not found
   */
  updateUpdate = (data: EquipmentUpdateSchema, params: RequestParams = {}) =>
    this.http.request<EquipmentGetSchema, void>({
      path: `/equipment/update`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
