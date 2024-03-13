// Functions
import * as DbOperationsFunctions from '@services/db/Operations';
import * as SqlClientFuncs from '@services/db/SqlClient';
import * as QueryExecutors from '@services/db/QueryExecutors';
import * as DbFunctions from '@services/db/Functions';

// Test Objects
import {sampleStat} from '../../Objects';

// Types
import {SortOrders, syncDbTables} from '@shared/Constants';
import {timestampFields} from '@shared/Constants';
import {BaseOperators} from '@services/api/swagger/data-contracts';
import {JoinOperators} from '@services/db/Constants';

jest.mock('@services/db/Functions', () => ({
  buildSqlQuery: jest.fn().mockReturnValue('fakeSql'),
  transformDbRows: jest.fn().mockReturnValue([{fakeCol: 'fakeVal'}]),
}));

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
      error: null,
    };

    jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([executeSqlBatchRes, executeSqlBatchRes]);

    // Act
    const response = await DbOperationsFunctions.insertRows(
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
      await DbOperationsFunctions.insertRows(syncDbTables.bodyStatTable, []);
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
        error: null,
      },
    ]);

    const response = await DbOperationsFunctions.updateRows(tableName, [
      sampleStat,
    ]);

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
        error: null,
      },
    ]);

    const response = await DbOperationsFunctions.updateRows(tableName, [
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

    const response = await DbOperationsFunctions.updateRows(tableName, [
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
      await DbOperationsFunctions.updateRows(syncDbTables.bodyStatTable, []);
      fail('Function did not throw as expected');
    } catch (error: any) {
      expect(error.message).toBe('No data to insert.');
    }

    expect(QueryExecutors.getTimestampForRow).toHaveBeenCalledTimes(0);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(0);
  });

  test('getRows', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        originalQuery: {
          sqlStatement: 'fakeSql',
        },
        result: [{fakeCol: 'fakeVal'}],
        error: null,
      },
    ]);

    // Act
    const response = await DbOperationsFunctions.getRows({
      tableName: syncDbTables.bodyStatTable,
      selectColumns: ['fakeCol'],
      joins: {
        [syncDbTables.userTable]: {
          on: {
            [`${syncDbTables.bodyStatTable}.fakeCol`]: {
              [BaseOperators.Eq]: {
                isLiteral: true,
                value: `${syncDbTables.userTable}.fakeCol`,
              },
            },
          },
          join: JoinOperators.INNER,
        },
      },
      groupby: ['fakeCol'],
      whereConditions: {
        fakeCol: {
          [BaseOperators.Eq]: '1',
        },
      },
      orderConditions: {
        fakeCol: SortOrders.ASC,
      },
      limit: 20,
    });

    // Assert
    expect(DbFunctions.buildSqlQuery).toHaveBeenCalledTimes(1);
    expect(DbFunctions.buildSqlQuery).toHaveBeenCalledWith({
      groupby: ['fakeCol'],
      joins: {
        user: {
          join: 'INNER',
          on: {
            'body_stat.fakeCol': {
              eq: {
                isLiteral: true,
                value: 'user.fakeCol',
              },
            },
          },
        },
      },
      limit: 20,
      orderConditions: {
        fakeCol: 'ASC',
      },
      selectColumns: ['fakeCol'],
      table: 'body_stat',
      whereConditions: {
        'body_stat.deleted': {
          isfalse: null,
        },
        fakeCol: {
          eq: '1',
        },
      },
    });
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {sqlStatement: 'fakeSql'},
    ]);
    expect(DbFunctions.transformDbRows).toHaveBeenCalledTimes(1);
    expect(DbFunctions.transformDbRows).toHaveBeenCalledWith([
      {fakeCol: 'fakeVal'},
    ]);
    expect(response).toEqual([{fakeCol: 'fakeVal'}]);
  });
});
