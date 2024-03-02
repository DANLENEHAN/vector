// Services
import moment from 'moment-timezone';

// Functions
import {getQueryCondition} from '@services/db/Functions';

// Constants
import {timestampColumns} from '@shared/Constants';
import {
  BaseOperators,
  NumericOperators,
  StringOperators,
} from '@services/api/swagger/data-contracts';

jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
}));

describe('DB Functions Tests', () => {
  const sampleTimeStamp = '2024-02-29T04:00:00.000';
  const timezone = 'America/Toronto';

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
});
