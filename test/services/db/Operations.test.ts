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

jest.mock('@services/db/Functions', () => ({
  ...jest.requireActual('@services/db/Functions'),
  buildWhereClause: jest.fn(),
  buildJoinClause: jest.fn(),
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

  test('getRows - table name param only', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);

    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(0);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.clientSessionEventTable} ` +
          `WHERE ${syncDbTables.clientSessionEventTable}.deleted is False;`,
      },
    ]);

    expect(response).toEqual([]);
  });

  test('getRows - table name and select columns', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);

    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      selectColumns: ['col1', 'col2'],
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(0);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT col1, col2 FROM ${syncDbTables.clientSessionEventTable}` +
          ` WHERE ${syncDbTables.clientSessionEventTable}.deleted is False;`,
      },
    ]);

    expect(response).toEqual([]);
  });

  test('getRows - table name and where object', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);

    jest
      .spyOn(DbFunctions, 'buildWhereClause')
      .mockImplementationOnce(jest.fn(() => '(fakeCol = 1)'));

    const tableName = syncDbTables.clientSessionEventTable;
    const whereConditions = {fakeCol: {eq: 1}};
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      whereConditions: whereConditions,
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(1);
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledWith(whereConditions);

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.clientSessionEventTable} ` +
          `WHERE (fakeCol = 1) AND ${syncDbTables.clientSessionEventTable}.deleted is False;`,
      },
    ]);

    expect(response).toEqual([]);
  });

  test('getRows - table name and join object', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);
    jest
      .spyOn(DbFunctions, 'buildJoinClause')
      .mockReturnValueOnce(
        `${JoinOperators.INNER} JOIN ${syncDbTables.exerciseBodypart} ` +
          `ON (${syncDbTables.exercise}.exercise_id = ${syncDbTables.exerciseBodypart}.exercise_id)`,
      );

    const tableName = syncDbTables.exercise;
    const joins = {
      // Join One
      [syncDbTables.exerciseBodypart]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.exercise}.exercise_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${syncDbTables.exerciseBodypart}.exercise_id`,
            },
          },
        },
      },
    };
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      joins,
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(0);
    expect(DbFunctions.buildJoinClause).toHaveBeenCalledTimes(1);
    expect(DbFunctions.buildJoinClause).toHaveBeenCalledWith(joins);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.exercise} ` +
          `INNER JOIN ${syncDbTables.exerciseBodypart} ON (${syncDbTables.exercise}.exercise_id = ${syncDbTables.exerciseBodypart}.exercise_id) ` +
          `WHERE ${syncDbTables.exercise}.deleted is False;`,
      },
    ]);

    expect(response).toEqual([]);
  });

  test('getRows - table name and order by object', async () => {
    // Arrange
    const orderConditions = {
      created_at: SortOrders.DESC,
      updated_at: SortOrders.ASC,
    };
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);

    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      orderConditions: orderConditions,
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(0);

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.clientSessionEventTable} WHERE ` +
          `${syncDbTables.clientSessionEventTable}.deleted is False ORDER BY ` +
          `created_at DESC, updated_at ASC;`,
      },
    ]);
    expect(response).toEqual([]);
  });

  test('getRows - groupby included', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);

    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      groupby: ['col1', 'col2'],
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(0);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.clientSessionEventTable} WHERE ` +
          `${syncDbTables.clientSessionEventTable}.deleted is False ` +
          `GROUP BY col1, col2;`,
      },
    ]);
    expect(response).toEqual([]);
  });

  test('getRows - table name and limit string', async () => {
    // Arrange
    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [],
        originalQuery: {
          sqlStatement: '',
        },
      },
    ]);

    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      limit: 1,
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(0);

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement:
          `SELECT * FROM ${syncDbTables.clientSessionEventTable} WHERE ` +
          `${syncDbTables.clientSessionEventTable}.deleted is False LIMIT 1;`,
      },
    ]);
    expect(response).toEqual([]);
  });

  test('getRows - all params', async () => {
    // Arrange
    const selectColumns = ['exercise_id'];
    const whereConditions = {exercise_id: {eq: 1}};
    const orderConditions = {exercise_id: SortOrders.DESC};
    const joins = {
      // Join One
      [syncDbTables.exerciseBodypart]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.exercise}.exercise_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${syncDbTables.exerciseBodypart}.exercise_id`,
            },
          },
        },
      },
    };
    const sqlQuery =
      'SELECT exercise_id FROM client_session_event INNER JOIN exercise_bodypart ' +
      'ON (exercise.exercise_id = exercise_bodypart.exercise_id) WHERE (exercise_id = 1) ' +
      'AND client_session_event.deleted is False ORDER BY exercise_id DESC LIMIT 1;';

    jest.spyOn(SqlClientFuncs, 'executeSqlBatch').mockResolvedValueOnce([
      {
        error: null,
        result: [{exercise_id: '5f505af9-92ca-445f-ba0e-8e936933662c'}],
        originalQuery: {
          sqlStatement: sqlQuery,
        },
      },
    ]);
    jest
      .spyOn(DbFunctions, 'buildJoinClause')
      .mockReturnValueOnce(
        `${JoinOperators.INNER} JOIN ${syncDbTables.exerciseBodypart} ` +
          `ON (${syncDbTables.exercise}.exercise_id = ${syncDbTables.exerciseBodypart}.exercise_id)`,
      );
    jest
      .spyOn(DbFunctions, 'buildWhereClause')
      .mockReturnValueOnce('(exercise_id = 1)');

    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = await DbOperationsFunctions.getRows({
      tableName,
      selectColumns,
      joins,
      whereConditions,
      orderConditions,
      limit: 1,
    });

    // Assert
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledTimes(1);
    expect(DbFunctions.buildJoinClause).toHaveBeenCalledTimes(1);
    expect(DbFunctions.buildJoinClause).toHaveBeenCalledWith(joins);
    expect(DbFunctions.buildWhereClause).toHaveBeenCalledWith(whereConditions);

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlQuery,
      },
    ]);
    expect(response).toEqual([
      {exercise_id: '5f505af9-92ca-445f-ba0e-8e936933662c'},
    ]);
  });
});
