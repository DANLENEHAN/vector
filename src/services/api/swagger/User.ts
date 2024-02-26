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
  QuerySchema,
  UserCreateSchema,
  UserGetSchema,
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
   * @response `401` `void` User not authenticated
   */
  authenticatedList = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/authenticated`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description Create a new User.
   *
   * @tags User
   * @name CreateCreate
   * @summary Create a new User.
   * @request POST:/user/create
   * @secure
   * @response `204` `void` User retrieved successfully
   * @response `400` `void` Bad request
   * @response `404` `void` User foreign key constraint not found
   */
  createCreate = (
    data: UserCreateSchema,
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
      path: `/user/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a User.
   *
   * @tags User
   * @name DeleteStringUserIdDelete
   * @summary Delete a User.
   * @request DELETE:/user/delete/{string:user_id}
   * @secure
   * @response `204` `void` User deleted successfully
   * @response `400` `void` User validation error
   * @response `404` `void` User not found
   */
  deleteStringUserIdDelete = (userId: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/user/delete/{string${userId}}`,
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
   * @description Get specific User for a user.
   *
   * @tags User
   * @name GetStringUserIdList
   * @summary Get a specific User for a user.
   * @request GET:/user/get/{string:user_id}
   * @secure
   * @response `200` `UserCreateSchema` User for user retrieved successfully
   * @response `404` `void` User not found
   */
  getStringUserIdList = (userId: string, params: RequestParams = {}) =>
    this.http.request<UserCreateSchema, void>({
      path: `/user/get/{string${userId}}`,
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
 * @response `201` `{
  \**
   * Unique user identifier.
   * @example 123
   *\
    user_id?: number,

}` Login successful Note: The below doesn't actually work but is important for understanding how the login/logout and session management system works. See issue here: https://github.com/swagger-api/swagger-ui/issues/5596 The session ID is returned in the Response headers `Set-Cookie` headers `session` key. You need to include this cookie in subsequent requests. If using Swagger UI, you can find the cookie in the network tab of the developer tools. Add the cookie to the request headers by clicking the Lock/Authorize button in the UI at the top of page for global authorization or on a per request basis at the endpoint level.
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
    this.http.request<
      {
        /**
         * Unique user identifier.
         * @example 123
         */
        user_id?: number;
      },
      void
    >({
      path: `/user/login`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
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
   * @description Get User for a user based on query.
   *
   * @tags User
   * @name PostUser
   * @summary Get User for a user based on query.
   * @request POST:/user/get
   * @secure
   * @response `204` `(UserCreateSchema)[]` User for user retrieved successfully
   * @response `400` `void` Query validation error
   */
  postUser = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<UserCreateSchema[], void>({
      path: `/user/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a User for a user.
   *
   * @tags User
   * @name UpdateUpdate
   * @summary Update a User for a user.
   * @request PUT:/user/update
   * @secure
   * @response `201` `void` User updated successfully
   * @response `400` `void` User validation error
   * @response `404` `void` User not found or foreign key constraint not found
   */
  updateUpdate = (
    data: UserUpdateSchema,
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
      path: `/user/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
