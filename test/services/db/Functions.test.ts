// Services
import moment from 'moment-timezone';

// Functions
import {
  getQueryCondition,
  buildWhereClause,
  transformDbRows,
} from '@services/db/Functions';
import * as DateFunctions from '@services/date/Functions';

// Constants
import {timestampColumns} from '@shared/Constants';
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
    const response = getQueryCondition(columnName, columnValue, operator);

    // Assert
    expect(response).toEqual("datetime(created_at) < '2024-02-29 09:00:00'");
  });

  test('getQueryCondition - timestamp column, invalid value valid operator', () => {
    // Arrange
    const columnName = timestampColumns.CREATED_AT;
    const columnValue = timezone;
    const operator = NumericOperators.Lt;

    // Act
    expect(() => getQueryCondition(columnName, columnValue, operator)).toThrow(
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
      getQueryCondition(columnName, columnValue, operator as any),
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
    const response = getQueryCondition(columnName, columnValue, operator);

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
    expect(() => getQueryCondition(columnName, columnValue, operator)).toThrow(
      'Boolean and Null checks must not include a column value.',
    );
  });

  test('getQueryCondition - number value, valid operator', () => {
    // Arrange
    const columnName = 'numberColumn';
    const columnValue = 1;
    const operator = BaseOperators.Eq;

    // Act
    const response = getQueryCondition(columnName, columnValue, operator);

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
    expect(() => getQueryCondition(columnName, columnValue, operator)).toThrow(
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
    const response = getQueryCondition(columnName, columnValue, operator);

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
      getQueryCondition(columnName, columnValue, operator as any),
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
    const response = getQueryCondition(columnName, columnValue, operator);

    // Assert
    expect(response).toEqual("stringColumn LIKE 'cap%'");
  });

  test('getQueryCondition - array value, valid operator', () => {
    // Arrange
    const columnName = 'stringColumn';
    const columnValue = [2, '1', 3, '5'];
    const operator = BaseOperators.In;

    // Act
    const response = getQueryCondition(columnName, columnValue, operator);

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
    expect(() => getQueryCondition(columnName, columnValue, operator)).toThrow(
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
      getQueryCondition(columnName, columnValue as any, operator),
    ).toThrow(`Cannot Query with nested array values ${columnValue}`);
  });

  test('buildWhereClause - basic whereConditions object ', () => {
    // Arrange
    // Act
    const response = buildWhereClause({
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
    const response = buildWhereClause(sampleWhereConditionsFlatObject);
    // Assert
    expect(response).toEqual(
      '(numberCol = 20 and numberCol <= 30 and stringCol = 10 and stringCol <= 20)',
    );
  });

  test('buildWhereClause - flat whereConditions object ', () => {
    // Arrange
    // Act
    const response = buildWhereClause(sampleWhereConditionsNestedObject);

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
    const response = transformDbRows([
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
    const response = transformDbRows(fakeData);

    // Assert
    expect(deviceTimezoneSpy).toHaveBeenCalledTimes(0);
    expect(momentToDateStrSpy).toHaveBeenCalledTimes(0);
    expect(response).toEqual(fakeData);
  });
});
