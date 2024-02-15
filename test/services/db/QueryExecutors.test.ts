// Functions
import * as SqlClientFuncs from '@services/db/SqlClient';
import * as SyncQueries from '@services/db/sync/Queries';
import * as QueryExecutors from '@services/db/QueryExecutors';

// Test Objects
import {sampleStat} from '../../Objects';
import {generateDeletionQueryResponse} from './Objects';

// Types
import {syncDbTables} from '@shared/Constants';
import {timestampFields} from '@shared/Constants';
import {generateDeletionQuery} from '@services/db/Queries';

const fakseSql = 'fakeSql';

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test(`getTimestampForRow get ${timestampFields.createdAt} from existing row`, async () => {
    const tableName = syncDbTables.bodyStatTable;
    jest.spyOn(SyncQueries, 'getRowByIdQuery').mockReturnValueOnce(fakseSql);
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        originalQuery: {
          sqlStatement: fakseSql,
        },
        result: [sampleStat],
        error: null,
      },
    ]);

    const response = await QueryExecutors.getTimestampForRow(
      tableName,
      timestampFields.createdAt,
      sampleStat.body_stat_id,
    );

    expect(SyncQueries.getRowByIdQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getRowByIdQuery).toHaveBeenCalledWith(
      tableName,
      sampleStat.body_stat_id,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: fakseSql,
      },
    ]);
    expect(response).toEqual(sampleStat.created_at);
  });

  test(`getTimestampForRow get ${timestampFields.updatedAt} from existing row`, async () => {
    const tableName = syncDbTables.bodyStatTable;
    jest.spyOn(SyncQueries, 'getRowByIdQuery').mockReturnValueOnce(fakseSql);
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        originalQuery: {
          sqlStatement: fakseSql,
        },
        result: [sampleStat],
        error: null,
      },
    ]);

    const response = await QueryExecutors.getTimestampForRow(
      tableName,
      timestampFields.updatedAt,
      sampleStat.body_stat_id,
    );

    expect(SyncQueries.getRowByIdQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getRowByIdQuery).toHaveBeenCalledWith(
      tableName,
      sampleStat.body_stat_id,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: fakseSql,
      },
    ]);
    expect(response).toEqual(sampleStat.updated_at);
  });

  test(`getTimestampForRow get ${timestampFields.updatedAt} row doesn't exist`, async () => {
    const tableName = syncDbTables.bodyStatTable;
    jest.spyOn(SyncQueries, 'getRowByIdQuery').mockReturnValueOnce(fakseSql);
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        originalQuery: {
          sqlStatement: fakseSql,
        },
        result: [],
        error: null,
      },
    ]);

    const response = await QueryExecutors.getTimestampForRow(
      tableName,
      timestampFields.updatedAt,
      sampleStat.body_stat_id,
    );

    expect(SyncQueries.getRowByIdQuery).toHaveBeenCalledTimes(1);
    expect(SyncQueries.getRowByIdQuery).toHaveBeenCalledWith(
      tableName,
      sampleStat.body_stat_id,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: fakseSql,
      },
    ]);
    expect(response).toEqual(null);
  });

  test('deleteDB runs inital query and all subsquent queries', async () => {
    jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: generateDeletionQuery,
          },
          error: null,
          result: generateDeletionQueryResponse,
        },
      ])
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: Object.values(generateDeletionQueryResponse[0])[0],
          },
          result: [],
          error: null,
        },
        {
          originalQuery: {
            sqlStatement: Object.values(generateDeletionQueryResponse[1])[0],
          },
          result: [],
          error: null,
        },
      ]);

    await QueryExecutors.deleteDB();

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(2);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenNthCalledWith(1, [
      {
        sqlStatement: generateDeletionQuery,
      },
    ]);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenNthCalledWith(2, [
      {
        sqlStatement: Object.values(generateDeletionQueryResponse[0])[0],
      },
      {
        sqlStatement: Object.values(generateDeletionQueryResponse[1])[0],
      },
    ]);
  });
});
