// Services
import moment from 'moment-timezone';

// Functions
import * as DbFunctions from '@services/db/Functions';
import * as SqlClientFuncs from '@services/db/SqlClient';
import * as DateFunctions from '@services/date/Functions';

// Constants
import {
  SortOrders,
  otherDbTables,
  syncDbTables,
  timestampColumns,
} from '@shared/Constants';
import {
  BaseOperators,
  NumericOperators,
  StringOperators,
} from '@services/api/swagger/data-contracts';
import {TimestampFormat} from '@shared/Enums';

// Test Objects
import {
  sampleWhereConditionsFlatObject,
  sampleTimeStamp,
  timezone,
  sampleWhereConditionsNestedObject,
} from './Objects';
import {JoinOperators} from '@services/db/Constants';

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getQueryCondition - timestamp column, valid value and operator', () => {
    // Arrange
    const columnName = timestampColumns.CREATED_AT;
    const columnValue = moment.tz(sampleTimeStamp, timezone);
    const operator = NumericOperators.Lt;

    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual("datetime(created_at) < '2024-02-29 09:00:00'");
  });

  test('getQueryCondition - timestamp column, invalid value valid operator', () => {
    // Arrange
    const columnName = timestampColumns.CREATED_AT;
    const columnValue = timezone;
    const operator = NumericOperators.Lt;

    // Act
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue, operator),
    ).toThrow(
      'Date value must be a moment.Moment object for timestamp columns.',
    );
  });

  test('getQueryCondition - timestamp column, valid value invalid operator', () => {
    // Arrange
    const columnName = timestampColumns.CREATED_AT;
    const columnValue = moment.tz(sampleTimeStamp, timezone);
    const operator = 'fakeOperator';

    // Act
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue, operator as any),
    ).toThrow(
      `Operator '${operator}' is not allowed for timestamp columns. ` +
        'Allowed operators include BaseOperators and NumericOperators.',
    );
  });

  test('getQueryCondition - boolean operation, valid value and operator', () => {
    // Arrange
    const columnName = 'boolColumn';
    const columnValue = null;
    const operator = BaseOperators.Isnull;

    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual('boolColumn IS NULL');
  });

  test('getQueryCondition - boolean operation, non null value and valid operator', () => {
    // Arrange
    const columnName = 'boolColumn';
    const columnValue = 1;
    const operator = BaseOperators.Isnull;

    // Act
    // Assert
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue, operator),
    ).toThrow('Boolean and Null checks must not include a column value.');
  });

  test('getQueryCondition - number value, valid operator', () => {
    // Arrange
    const columnName = 'numberColumn';
    const columnValue = 1;
    const operator = BaseOperators.Eq;

    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual('numberColumn = 1');
  });

  test('getQueryCondition - number value, invalid operator', () => {
    // Arrange
    const columnName = 'numberColumn';
    const columnValue = 1;
    const operator = StringOperators.Startswith;

    // Act
    // Assert
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue, operator),
    ).toThrow(
      `Operator '${operator}' is not allowed for number values. ` +
        'Allowed operators include BaseOperators and NumericOperators.',
    );
  });

  test('getQueryCondition - string value, valid operator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = '1';
    const operator = BaseOperators.Eq;

    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual("stringColumn = '1'");
  });

  test('getQueryCondition - string value, invalid operator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = '1';
    const operator = 'fakeOperator';

    // Act
    // Assert
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue, operator as any),
    ).toThrow(
      `Operator '${operator}' is not allowed for string values. Allowed ` +
        'operators include BaseOperators, NumericOperators, and StringOperators.',
    );
  });

  test('getQueryCondition - string value, StringOperator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = 'cap';
    const operator = StringOperators.Startswith;

    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual("stringColumn LIKE 'cap%'");
  });

  test('getQueryCondition - array value, valid operator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = [2, '1', 3, '5'];
    const operator = BaseOperators.In;

    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual("stringColumn IN (2, '1', 3, '5')");
  });

  test('getQueryCondition - array value, invalid operator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = [2, '1', 3, '5'];
    const operator = BaseOperators.Eq;

    // Act
    // Assert
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue, operator),
    ).toThrow(
      `Operator '${operator}' is not allowed for array values. Allowed ` +
        'operators include BaseOperators.NotIn and BaseOperators.NotIn.',
    );
  });

  test('getQueryCondition - nested object value, valid operator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = [2, '1', 3, '5', [1]];
    const operator = BaseOperators.In;

    // Act
    // Assert
    expect(() =>
      DbFunctions.getQueryCondition(columnName, columnValue as any, operator),
    ).toThrow(`Cannot Query with nested array values ${columnValue}`);
  });

  test('getQueryCondition - literal valid, valid operator', () => {
    // Arrange
    const columnName = 'fakeCol';
    const operator = NumericOperators.Lt;
    const columnValue = {
      isLiteral: true,
      value: 'otherFakeCol',
    };
    // Act
    const response = DbFunctions.getQueryCondition(
      columnName,
      columnValue,
      operator,
    );

    // Assert
    expect(response).toEqual('fakeCol < otherFakeCol');
  });

  test('buildWhereClause - basic whereConditions object ', () => {
    // Arrange
    // Act
    const response = DbFunctions.buildWhereClause({
      fakeCol: {
        eq: 1,
      },
    });
    // Assert
    expect(response).toEqual('(fakeCol = 1)');
  });

  test('buildWhereClause - flat whereConditions object ', () => {
    // Arrange
    // Act
    const response = DbFunctions.buildWhereClause(
      sampleWhereConditionsFlatObject,
    );
    // Assert
    expect(response).toEqual(
      '(numberCol = 20 and numberCol <= 30 and stringCol = 10 and stringCol <= 20)',
    );
  });

  test('buildWhereClause - flat whereConditions object ', () => {
    // Arrange
    // Act
    const response = DbFunctions.buildWhereClause(
      sampleWhereConditionsNestedObject,
    );

    // Assert
    expect(response).toEqual(
      "((((datetime(created_at) = '2024-02-29 09:00:00' or datetime(created_at) " +
        "<= '2024-02-29 09:00:00' or datetime(updated_at) = '2024-02-29 09:00:00' or " +
        "datetime(updated_at) <= '2024-02-29 09:00:00') and numberColumn = 10 and " +
        "stringColumn = '2') or arrayColumn IN ('10', 2, 3, '62')))",
    );
  });

  test('transformDbRows - object contains timestamp rows', () => {
    // Arrange
    const deviceTimezone = 'America/Toronto';
    const deviceTimezoneSpy = jest
      .spyOn(DateFunctions, 'deviceTimezone')
      .mockReturnValue('America/Toronto');
    const momentToDateStrSpy = jest
      .spyOn(DateFunctions, 'momentToDateStr')
      .mockReturnValue('transformedDate');

    // Act
    const response = DbFunctions.transformDbRows([
      {
        created_at: '2024-02-08T10:30:36.989',
        updated_at: '2024-02-08T10:30:36.989000Z',
      },
    ]);

    // Assert
    expect(deviceTimezoneSpy).toHaveBeenCalledTimes(2);
    expect(momentToDateStrSpy).toHaveBeenCalledTimes(2);
    expect(momentToDateStrSpy).toHaveBeenNthCalledWith(
      1,
      moment.tz('2024-02-08T10:30:36.989', 'UTC').tz(deviceTimezone),
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    expect(momentToDateStrSpy).toHaveBeenNthCalledWith(
      2,
      moment.tz('2024-02-08T10:30:36.989000Z', 'UTC').tz(deviceTimezone),
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );

    expect(response).toEqual([
      {created_at: 'transformedDate', updated_at: 'transformedDate'},
    ]);
  });

  test('transformDbRows - object contains timestamp rows', () => {
    // Arrange
    const fakeData = [
      {
        fakeCol1: 1,
        fakeCol2: 2,
      },
    ];
    const deviceTimezoneSpy = jest
      .spyOn(DateFunctions, 'deviceTimezone')
      .mockReturnValue('');
    const momentToDateStrSpy = jest
      .spyOn(DateFunctions, 'momentToDateStr')
      .mockReturnValue('');

    // Act
    const response = DbFunctions.transformDbRows(fakeData);

    // Assert
    expect(deviceTimezoneSpy).toHaveBeenCalledTimes(0);
    expect(momentToDateStrSpy).toHaveBeenCalledTimes(0);
    expect(response).toEqual(fakeData);
  });

  test('returns true for a literal object', () => {
    const literalObj = {isLiteral: true, value: 'test'};
    expect(DbFunctions.isLiteralObject(literalObj)).toBe(true);
  });

  test('returns false for an object without isLiteral property', () => {
    const nonLiteralObj = {value: 'test'};
    expect(DbFunctions.isLiteralObject(nonLiteralObj)).toBe(false);
  });

  test('returns false for an object with isLiteral set to false', () => {
    const nonLiteralObj = {isLiteral: false, value: 'test'};
    expect(DbFunctions.isLiteralObject(nonLiteralObj)).toBe(false);
  });

  test('returns false for a non-object', () => {
    const notAnObject = 'I am not an object';
    expect(DbFunctions.isLiteralObject(notAnObject)).toBe(false);
  });

  test('returns false for null', () => {
    const nullValue = null;
    expect(DbFunctions.isLiteralObject(nullValue)).toBe(false);
  });

  test('buildJoinClause', () => {
    // Arrange
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
      // Join Two
      [syncDbTables.exerciseEquipment]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.exercise}.exercise_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${syncDbTables.exerciseEquipment}.exercise_id`,
            },
          },
        },
      },
      // Join Three
      [syncDbTables.equipment]: {
        join: JoinOperators.INNER,
        on: {
          [`${syncDbTables.equipment}.equipment_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${syncDbTables.exerciseEquipment}.equipment_id`,
            },
          },
        },
      },
      // Join Four
      [otherDbTables.bodypart]: {
        join: JoinOperators.INNER,
        on: {
          [`${otherDbTables.bodypart}.bodypart_id`]: {
            [BaseOperators.Eq]: {
              isLiteral: true,
              value: `${syncDbTables.exerciseBodypart}.bodypart_id`,
            },
          },
        },
      },
    };

    // Act
    const response = DbFunctions.buildJoinClause(joins);

    // Assert
    expect(response).toEqual(
      'INNER JOIN exercise_bodypart ON (exercise.exercise_id = ' +
        'exercise_bodypart.exercise_id) INNER JOIN exercise_equipment ' +
        'ON (exercise.exercise_id = exercise_equipment.exercise_id) INNER ' +
        'JOIN equipment ON (equipment.equipment_id = exercise_equipment.equipment_id) ' +
        'INNER JOIN bodypart ON (bodypart.bodypart_id = exercise_bodypart.bodypart_id)',
    );
  });

  test('buildSqlQuery - table name param only', () => {
    // Arrange
    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = DbFunctions.buildSqlQuery({
      table: tableName,
    });
    // Assert
    expect(response).toEqual('SELECT * FROM client_session_event');
  });

  test('getRows - table name and select columns', async () => {
    // Arrange
    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      selectColumns: ['col1', 'col2'],
    });

    // Assert
    expect(response).toEqual('SELECT col1, col2 FROM client_session_event');
  });

  test('getRows - table name and where object', async () => {
    // Arrange
    const tableName = syncDbTables.clientSessionEventTable;
    const whereConditions = {fakeCol: {eq: 1}};
    // Act

    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      whereConditions: whereConditions,
    });

    // Assert
    expect(response).toEqual(
      'SELECT * FROM client_session_event WHERE (fakeCol = 1)',
    );
  });

  test('getRows - table name and join object', async () => {
    // Arrange
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

    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      joins,
    });

    // Assert
    expect(response).toEqual(
      'SELECT * FROM exercise INNER JOIN exercise_bodypart ON (exercise.exercise_id = exercise_bodypart.exercise_id)',
    );
  });

  test('getRows - table name and order by object', async () => {
    // Arrange
    const orderConditions = {
      created_at: SortOrders.DESC,
      updated_at: SortOrders.ASC,
    };
    const tableName = syncDbTables.clientSessionEventTable;
    // Act
    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      orderConditions: orderConditions,
    });

    // Assert
    expect(response).toEqual(
      'SELECT * FROM client_session_event ORDER BY created_at DESC, updated_at ASC',
    );
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

    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      groupby: ['col1', 'col2'],
    });

    // Assert
    expect(response).toEqual(
      'SELECT * FROM client_session_event GROUP BY col1, col2',
    );
  });

  test('getRows - table name and limit string', async () => {
    // Arrange
    const tableName = syncDbTables.clientSessionEventTable;
    // Act
    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      limit: 1,
    });

    // Assert
    expect(response).toEqual('SELECT * FROM client_session_event LIMIT 1');
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
    const tableName = syncDbTables.clientSessionEventTable;
    // Act

    const response = DbFunctions.buildSqlQuery({
      table: tableName,
      selectColumns,
      joins,
      whereConditions,
      orderConditions,
      limit: 1,
    });

    // Assert
    expect(response).toEqual(
      'SELECT exercise_id FROM client_session_event INNER JOIN exercise_bodypart ON ' +
        '(exercise.exercise_id = exercise_bodypart.exercise_id) WHERE (exercise_id = 1) ' +
        'ORDER BY exercise_id DESC LIMIT 1',
    );
  });
});
