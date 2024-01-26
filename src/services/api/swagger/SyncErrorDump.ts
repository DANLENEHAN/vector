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

import {SyncErrorDumpCreateSchema} from './data-contracts';
import {ContentType, HttpClient, RequestParams} from './http-client';

export class SyncErrorDump<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a synchronization error dump entry. This route requires authentication, and it handles POST requests to create a synchronization error dump entry. The provided JSON payload is passed to the create_sync_error_dump function, which validates the data and adds it to the database session. The response is then handled by the api_response_handler.
   *
   * @tags Sync Error Dump
   * @name CreateCreate
   * @summary Create a synchronization error dump entry
   * @request POST:/sync_error_dump/create
   * @response `201` `void` Synchronization error dump created successfully
   * @response `400` `void` Synchronization error dump validation error
   */
  createCreate = (
    data: SyncErrorDumpCreateSchema,
    params: RequestParams = {},
  ) =>
    this.http.request<void, void>({
      path: `/sync_error_dump/create`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
