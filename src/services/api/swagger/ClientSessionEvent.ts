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
  ClientSessionEventCreateSchema,
  ClientSessionEventUpdateSchema,
  QuerySchema,
} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class ClientSessionEvent<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new client_session_event.
   *
   * @tags ClientSessionEvent
   * @name CreateCreate
   * @summary Create a new client_session_event.
   * @request POST:/client_session_event/create
   * @secure
   * @response `204` `void` Client session events retrieved successfully
   * @response `400` `void` Query parameter validation error
   */
  createCreate = (
    data: ClientSessionEventCreateSchema,
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
      path: `/client_session_event/create`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Delete a client_session_event.
   *
   * @tags ClientSessionEvent
   * @name DeleteStringClientSessionEventIdDelete
   * @summary Delete a client_session_event.
   * @request DELETE:/client_session_event/delete/{string:client_session_event_id}
   * @secure
   * @response `204` `void` Client session event deleted successfully
   * @response `404` `void` Client session event not found
   */
  deleteStringClientSessionEventIdDelete = (
    clientSessionEventId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/client_session_event/delete/{string${clientSessionEventId}}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Get a client_session_event.
   *
   * @tags ClientSessionEvent
   * @name GetStringClientSessionEventIdList
   * @summary Get a client_session_event.
   * @request GET:/client_session_event/get/{string:client_session_event_id}
   * @secure
   * @response `200` `ClientSessionEventCreateSchema` Client session event retrieved successfully
   * @response `404` `void` Client session event not found
   */
  getStringClientSessionEventIdList = (
    clientSessionEventId: string,
    params: RequestParams = {},
  ) =>
    this.http.request<ClientSessionEventCreateSchema, void>({
      path: `/client_session_event/get/{string${clientSessionEventId}}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get client_session_events.
   *
   * @tags ClientSessionEvent
   * @name PostClientSessionEvent
   * @summary Get client_session_events.
   * @request POST:/client_session_event/get
   * @secure
   * @response `204` `(ClientSessionEventCreateSchema)[]` Client session events found successfully
   * @response `400` `void` Query validation error
   */
  postClientSessionEvent = (data: QuerySchema, params: RequestParams = {}) =>
    this.http.request<ClientSessionEventCreateSchema[], void>({
      path: `/client_session_event/get`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a client_session_event.
   *
   * @tags ClientSessionEvent
   * @name UpdateUpdate
   * @summary Update a client_session_event.
   * @request PUT:/client_session_event/update
   * @secure
   * @response `204` `void` s retrieved successfully
   * @response `400` `void` Client session event validation error
   * @response `404` `void` Client session event not found
   */
  updateUpdate = (
    data: ClientSessionEventUpdateSchema,
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
      path: `/client_session_event/update`,
      method: 'PUT',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}