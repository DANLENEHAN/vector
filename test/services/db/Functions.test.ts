// Functions
import * as DbFunctions from '@services/db/Functions';
import * as SqlClientFuncs from '@services/db/SqlClient';
import * as QueryExecutors from '@services/db/QueryExecutors';

// Test Objects
import {sampleStat} from '../../Objects';

// Types
import {syncDbTables} from '@shared/Constants';
import {timestampFields} from '@shared/Constants';

jest.mock('@services/db/QueryExecutors', () => ({
  ...jest.requireActual('@services/db/QueryExecutors'),
  getTimestampForRow: jest
    .fn()
    .mockImplementation(
      (_: any, timestampField: timestampFields, uuid: string) => {
        const responseObject: any = {
          // Greater than updated at timestamp in 'sampleStat'
          '1': '2025-01-01T00:02:00.000',
          '2': '2025-01-01T00:02:00.000',
        };
        return responseObject[uuid] || null;
      },
    ),
}));

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('insertRows works with array of data', async () => {
    // Arrange
    const columns = Object.keys(sampleStat);
    const placeholders = columns.map(_ => '?').join(', ');
    const params = [sampleStat, sampleStat];
    const sqlStatement = `INSERT INTO ${
      syncDbTables.bodyStatTable
    } (${columns.join(', ')}) VALUES (${placeholders});`;

    const executeSqlBatchRes = {
      originalQuery: {
        sqlStatement: sqlStatement,
        params: params,
      },
      result: [],
    };

    jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([executeSqlBatchRes, executeSqlBatchRes]);

    // Act
    const response = await DbFunctions.insertRows(
      syncDbTables.bodyStatTable,
      params,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: Object.values(sampleStat),
      },
      {
        sqlStatement: sqlStatement,
        params: Object.values(sampleStat),
      },
    ]);
    expect(response).toEqual(undefined);
  });

  test('insertRows should throw if given now data', async () => {
    try {
      await DbFunctions.insertRows(syncDbTables.bodyStatTable, []);
      fail('Function did not throw as expected');
    } catch (error: any) {
      expect(error.message).toBe('No data to insert.');
    }
  });

  test('updateRows, no rows should be filtered out', async () => {
    const tableName = syncDbTables.bodyStatTable;
    const columns = Object.keys(sampleStat);
    const placeholders = columns.map(_ => '?');
    const sqlStatement = `REPLACE INTO ${tableName} (${columns.join(
      ', ',
    )}) VALUES (${placeholders.join(', ')});`;
    const params = Object.values(sampleStat);

    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        originalQuery: {
          sqlStatement: sqlStatement,
          params: params,
        },
        result: [],
      },
    ]);

    const response = await DbFunctions.updateRows(tableName, [sampleStat]);

    expect(QueryExecutors.getTimestampForRow).toHaveBeenCalledTimes(1);
    expect(QueryExecutors.getTimestampForRow).toHaveBeenCalledWith(
      tableName,
      timestampFields.updatedAt,
      sampleStat.body_stat_id,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: params,
      },
    ]);

    expect(response).toEqual(undefined);
  });

  test('updateRows, row filtered out due to older updated at', async () => {
    const tableName = syncDbTables.bodyStatTable;
    const columns = Object.keys(sampleStat);
    const placeholders = columns.map(_ => '?');
    const sqlStatement = `REPLACE INTO ${tableName} (${columns.join(
      ', ',
    )}) VALUES (${placeholders.join(', ')});`;
    const sampleStatTwo = {...sampleStat, body_stat_id: '1'};
    const params = Object.values(sampleStat);

    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        originalQuery: {
          sqlStatement: sqlStatement,
          params: params,
        },
        result: [],
      },
    ]);

    const response = await DbFunctions.updateRows(tableName, [
      sampleStat,
      sampleStatTwo,
    ]);

    expect(QueryExecutors.getTimestampForRow).toHaveBeenCalledTimes(2);
    expect(QueryExecutors.getTimestampForRow).toHaveBeenNthCalledWith(
      1,
      tableName,
      timestampFields.updatedAt,
      sampleStat.body_stat_id,
    );
    expect(QueryExecutors.getTimestampForRow).toHaveBeenNthCalledWith(
      2,
      tableName,
      timestampFields.updatedAt,
      sampleStatTwo.body_stat_id,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: params,
      },
    ]);

    expect(response).toEqual(undefined);
  });

  test('updateRows, all rows filtered out', async () => {
    const tableName = syncDbTables.bodyStatTable;
    const sampleStatTwo = {...sampleStat, body_stat_id: '1'};

    const response = await DbFunctions.updateRows(tableName, [
      {...sampleStat, body_stat_id: '2'},
      sampleStatTwo,
    ]);

    expect(QueryExecutors.getTimestampForRow).toHaveBeenCalledTimes(2);
    expect(QueryExecutors.getTimestampForRow).toHaveBeenNthCalledWith(
      1,
      tableName,
      timestampFields.updatedAt,
      '2',
    );
    expect(QueryExecutors.getTimestampForRow).toHaveBeenNthCalledWith(
      2,
      tableName,
      timestampFields.updatedAt,
      sampleStatTwo.body_stat_id,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(0);

    expect(response).toEqual(undefined);
  });

  test('updateRows, no rows passed', async () => {
    try {
      await DbFunctions.updateRows(syncDbTables.bodyStatTable, []);
      fail('Function did not throw as expected');
    } catch (error: any) {
      expect(error.message).toBe('No data to insert.');
    }

    expect(QueryExecutors.getTimestampForRow).toHaveBeenCalledTimes(0);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(0);
  });
});
