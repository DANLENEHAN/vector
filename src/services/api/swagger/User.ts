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
  UserCreateSchema,
  UserGetSchema,
  UserQuerySchema,
  UserUpdateSchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class User<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Test authentication.
   *
   * @tags Users
   * @name AuthenticatedList
   * @summary Test authentication.
   * @request GET:/user/authenticated
   * @secure
   * @response `200` `void` User authenticated
   * @response `500` `void` User not authenticated
   */
  authenticatedList = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/authenticated`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description Create a new user.
   *
   * @tags Users
   * @name CreateCreate
   * @summary Create a new user.
   * @request POST:/user/create
   * @response `204` `void` User created successfully
   * @response `400` `void` User validation error
   * @response `409` `void` User already exists
   */
  createCreate = (data: UserCreateSchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete user.
   *
   * @tags Users
   * @name DeleteDelete
   * @summary Delete User.
   * @request DELETE:/user/delete
   * @secure
   * @response `204` `void` User deleted
   * @response `500` `void` User not authenticated
   */
  deleteDelete = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/delete`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get user details.
   *
   * @tags Users
   * @name DetailsList
   * @summary Get User.
   * @request GET:/user/details
   * @secure
   * @response `200` `UserGetSchema` User details retrieved
   * @response `500` `void` User not authenticated
   */
  detailsList = (params: RequestParams = {}) =>
    this.http.request<UserGetSchema, void>({
      path: `/user/details`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Logs in and returns the authentication cookie
   *
   * @tags Users
   * @name LoginCreate
   * @summary Login a user
   * @request POST:/user/login
   * @response `204` `void` Login successful Note: The below doesn't actually work but is important for understanding how the login/logout and session management system works. See issue here: https://github.com/swagger-api/swagger-ui/issues/5596 The session ID is returned in the Response headers `Set-Cookie` headers `session` key. You need to include this cookie in subsequent requests. If using Swagger UI, you can find the cookie in the network tab of the developer tools. Add the cookie to the request headers by clicking the Lock/Authorize button in the UI at the top of page for global authorization or on a per request basis at the endpoint level.
   * @response `401` `void` Login failed
   */
  loginCreate = (
    data: {
      /** @example "dan@gmail.com" */
      email?: string;
      /** @example "RLp6^$L2Ro" */
      password?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/user/login`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Logout a user.
   *
   * @tags Users
   * @name LogoutCreate
   * @summary Logout a user.
   * @request POST:/user/logout
   * @secure
   * @response `204` `void` Logout successful
   * @response `400` `void` Logout failed due to invalid credentials
   */
  logoutCreate = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/logout`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * @description Get users from the database
   *
   * @tags Users
   * @name PostUser
   * @summary Get users
   * @request POST:/user/get
   * @secure
   * @response `204` `void` Users found successfully
   * @response `400` `void` Query validation error
   */
  postUser = (data: UserQuerySchema, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Update user details.
   *
   * @tags Users
   * @name UpdateUpdate
   * @summary Update User.
   * @request PUT:/user/update
   * @secure
   * @response `201` `UserUpdateSchema` User details updated
   * @response `400` `void` User validation error
   * @response `500` `void` User details not updated
   */
  updateUpdate = (data: UserCreateSchema, params: RequestParams = {}) =>
    this.http.request<UserUpdateSchema, void>({
      path: `/user/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
