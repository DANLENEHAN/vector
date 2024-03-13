// Services
import moment, {isMoment} from 'moment-timezone';

// Constants
import {OperatorMap, StringOperatorMap} from '@services/db/Constants';
import {
  BaseOperators,
  BooleanOperators,
  StringOperators,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
import {TimestampFormat} from '@shared/Enums';
import {timestampColumns, AndOrOperatos} from '@shared/Constants';
// Types
import {isInEnum} from '@shared/Functions';
// Functions
import {
  QueryOperators,
  RowData,
  Literal,
  SqlStatementParams,
} from '@services/db/Types';
import {momentToDateStr, deviceTimezone} from '@services/date/Functions';
import {format} from 'sql-formatter';

/**
 * Checks if a given object is a Literal object.
 *
 * A Literal object is defined as an object that specifically includes `isLiteral` set to `true` and also
 * contains a `value` property. This function is typically used to identify objects that should be treated
 * differently, such as not automatically wrapping their `value` in quotes when constructing SQL queries
 * or other string-based representations.
 *
 * @param {any} obj - The object to check for being a Literal object.
 * @returns {obj is Literal} A boolean indicating whether the provided object matches the Literal object structure.
 */
export const isLiteralObject = (obj: any): obj is Literal => {
  return (
    (obj || false) &&
    typeof obj === 'object' &&
    obj.isLiteral === true &&
    'value' in obj
  );
};

/**
 * Generates a query condition string based on column name, value, and operator.
 * This function handles different data types including moment.Moment, number, string,
 * and arrays of numbers or strings. It ensures that the operator is appropriate for
 * the type of the column value and formats the condition accordingly.
 *
 * @param {string} columnName - The name of the database column.
 * @param {moment.Moment | number | string | Array<number | string>} columnValue - The value
 *  for the column, which can be a date (moment.Moment), number, string, or an array of
 *  numbers or strings.
 * @param {QueryOperators} operator - The operator used in the query condition.
 * @returns {string} - The formatted query condition as a string.
 * @throws {Error} - Throws an error if the operator is not compatible with the column type
 *  or if the column value type is not handled properly.
 */
export const getQueryCondition = (
  columnName: string,
  columnValue:
    | moment.Moment
    | number
    | string
    | Array<number | string>
    | Literal
    | null,
  operator: QueryOperators,
): string => {
  // Transformation variables with initial values identical to the input parameters.
  let transformedColumnName: string = columnName;
  let transformedColumnValue:
    | moment.Moment
    | number
    | string
    | Array<number | string>
    | Literal
    | null = columnValue;

  // Handling Boolean and Null checks
  if (
    isInEnum(BooleanOperators, operator) ||
    operator === BaseOperators.Isnull ||
    operator === BaseOperators.Notnull
  ) {
    if (columnValue !== null) {
      throw new Error(
        'Boolean and Null checks must not include a column value.',
      );
    } else {
      return `${transformedColumnName} ${
        OperatorMap[
          operator as BaseOperators | NumericOperators | BooleanOperators
        ]
      }`;
    }
  }

  // Handling Timestamp Columns
  // TODO: This will need to work for Fully Qualified Column names
  else if (isInEnum(timestampColumns, columnName)) {
    if (
      !isInEnum(BaseOperators, operator) &&
      !isInEnum(NumericOperators, operator)
    ) {
      throw new Error(
        `Operator '${operator}' is not allowed for timestamp columns. ` +
          'Allowed operators include BaseOperators and NumericOperators.',
      );
    }
    if (isMoment(columnValue)) {
      transformedColumnName = `datetime(${columnName})`;
      transformedColumnValue = `'${momentToDateStr(
        columnValue.tz('UTC'),
        TimestampFormat.SqlLiteDatetimeFormat,
      )}'`;
    } else {
      throw new Error(
        'Date value must be a moment.Moment object for timestamp columns.',
      );
    }
  }

  // Handling Number Values
  else if (typeof columnValue === 'number') {
    if (
      !isInEnum(BaseOperators, operator) &&
      !isInEnum(NumericOperators, operator)
    ) {
      throw new Error(
        `Operator '${operator}' is not allowed for number values. ` +
          'Allowed operators include BaseOperators and NumericOperators.',
      );
    }
  }

  // Handling String Values
  else if (typeof columnValue === 'string') {
    if (
      !isInEnum(BaseOperators, operator) &&
      !isInEnum(NumericOperators, operator) &&
      !isInEnum(StringOperators, operator)
    ) {
      throw new Error(
        `Operator '${operator}' is not allowed for string values. Allowed ` +
          'operators include BaseOperators, NumericOperators, and StringOperators.',
      );
    } else {
      transformedColumnValue = `'${transformedColumnValue}'`;
    }
  }

  // Handling Array Values
  else if (Array.isArray(columnValue)) {
    if (operator !== BaseOperators.NotIn && operator !== BaseOperators.In) {
      throw new Error(
        `Operator '${operator}' is not allowed for array values. Allowed ` +
          'operators include BaseOperators.NotIn and BaseOperators.NotIn.',
      );
    } else {
      const transformedArray: string = columnValue
        .map(item => {
          if (typeof item === 'object') {
            throw new Error(
              `Cannot Query with nested array values ${columnValue}`,
            );
          } else if (typeof item === 'string') {
            return `'${item}'`;
          } else {
            return item;
          }
        })
        .join(', ');
      transformedColumnValue = `(${transformedArray})`;
    }
  }

  // Handling Literal String Values
  else if (isLiteralObject(columnValue)) {
    if (
      !isInEnum(BaseOperators, operator) &&
      !isInEnum(NumericOperators, operator) &&
      !isInEnum(StringOperators, operator)
    ) {
      throw new Error(
        `Operator '${operator}' is not allowed for literal values. Allowed ` +
          'operators include BaseOperators, NumericOperators, and StringOperators.',
      );
    } else {
      transformedColumnValue = columnValue.value;
    }
  }

  // Error for unhandled columnValue types
  else {
    throw new Error(`Unhandled column value type: ${typeof columnValue}.`);
  }

  // Constructing and returning the query condition string
  if (isInEnum(StringOperators, operator) && typeof columnValue === 'string') {
    return `${columnName} ${StringOperatorMap[operator as StringOperators](
      columnValue,
    )}`;
  } else {
    // Handling cases where columnValue is directly usable (number or formatted string)
    return `${transformedColumnName} ${
      OperatorMap[
        operator as BaseOperators | NumericOperators | BooleanOperators
      ]
    } ${transformedColumnValue}`;
  }
};

/**
 * Constructs a WHERE clause for SQL queries from a given set of conditions. This function
 * supports recursive construction of nested conditions using logical operators (AND, OR)
 * and handles a variety of operators for different data types. It defaults to using 'AND'
 * between conditions unless specified otherwise in `whereConditions`.
 *
 * @param {Object} whereConditions - An object representing the conditions for the WHERE clause.
 *                                   Keys represent column names or logical operators, and values
 *                                   are the conditions or nested conditions.
 * @param {string} logicalOperator - The logical operator ('AND' or 'OR') to use between conditions.
 *                                   Defaults to 'AND'.
 *
 * @returns {string} - The constructed WHERE clause as a string, enclosed in parentheses.
 *
 * @throws {Error} - Throws an error if an invalid operator is encountered.
 */
export const buildWhereClause = (
  whereConditions: any,
  // If a logicalOperator is not specified in the
  // whereConditions it will default to AND
  logicalOperator: AndOrOperatos = AndOrOperatos.AND,
): string => {
  const conditions: string[] = [];
  for (const key in whereConditions) {
    // If the key is a booleanOperator we must recursively call the function
    if (isInEnum(AndOrOperatos, key)) {
      conditions.push(
        buildWhereClause(whereConditions[key], key as AndOrOperatos),
      );
    } else {
      // If key is not a booleanOperator It's a column so gather the conditionals
      for (const [operator, value] of Object.entries(whereConditions[key])) {
        if (
          isInEnum(BaseOperators, operator) ||
          isInEnum(BooleanOperators, operator) ||
          isInEnum(StringOperators, operator) ||
          isInEnum(NumericOperators, operator)
        ) {
          conditions.push(
            getQueryCondition(key, value as any, operator as QueryOperators),
          );
        } else {
          throw new Error(
            `Invalid Query Structure for operator '${operator}'.`,
          );
        }
      }
    }
  }
  // Join the conditions on the Logical Operator before returning
  return `(${conditions.join(` ${logicalOperator} `)})`;
};

/**
 * Transforms an array of database rows, converting UTC timestamps in specified
 * columns to the device's local timezone format. It utilizes the `moment.js` library
 * for accurate timezone conversion, targeting columns identified within the
 * `timestampColumns` object. The function operates generically on arrays of objects
 * where each object's structure is defined by the type parameter `T`, extending
 * `Record<string, string | number>`.
 *
 * @template T - Represents the database row structure, ensuring the function's
 *               versatility across different data types.
 *
 * @param {T[]} rows - The database rows to transform, where each row is an object of type `T`.
 *
 * @returns {T[]} - The transformed rows with updated timestamps in the local timezone, formatted
 *                  according to `TimestampFormat.YYYYMMDDHHMMssSSS`.
 *
 * @throws {Error} - If timezone conversion fails due to invalid data or if a valid timezone
 *                   string cannot be obtained.
 */
export const transformDbRows = <T extends RowData>(rows: T[]): T[] => {
  return rows.map(row => {
    let transformedRow: T = {...row};
    for (const column of Object.values(timestampColumns)) {
      try {
        if (column in transformedRow) {
          // as any to allow us to reassign a generic here
          // Transform stored UTC timestamp to timezone of the device
          (transformedRow as any)[column] = momentToDateStr(
            moment.tz(row[column], 'UTC').tz(deviceTimezone()),
            TimestampFormat.YYYYMMDDHHMMssSSS,
          );
        }
      } catch {}
    }
    return transformedRow;
  });
};

/**
 * Constructs a SQL JOIN clause string from a given `joins` object.
 *
 * The `joins` object should have keys representing join aliases or identifiers, with each key mapping to an object
 * that specifies the type of join (e.g., INNER JOIN, LEFT JOIN) and the conditions for the join.
 * These conditions are passed to `buildWhereClause` to generate the ON clause of the JOIN.
 *
 * @param {Record<string, {join: string; on: any}>} joins - An object where each key represents a join, and the value
 * is an object containing `join` (type of join) and `on` (conditions for the join).
 * @returns {string} A string representing the SQL JOIN clause constructed from the input.
 */
export const buildJoinClause = (
  joins: Record<string, {join: string; on: any}>,
): string => {
  let parseJoins: Array<string> = [];
  Object.keys(joins).forEach(key => {
    parseJoins.push(
      `${joins[key].join} JOIN ${key} ON ${buildWhereClause(joins[key].on)}`,
    );
  });
  return parseJoins.join(' ');
};

/**
 * Builds a SQL query string based on the provided parameters.
 *
 * @param params - An object containing parameters for constructing the SQL query.
 * @param params.table - The name of the table to select data from.
 * @param params.selectColumns - An array of column names to select. Defaults to ["*"].
 * @param params.joins - An array of join clauses to apply in the query.
 * @param params.whereConditions - An array of conditions to apply in the WHERE clause.
 * @param params.groupby - An array of columns to group by.
 * @param params.orderConditions - An object containing column names as keys and sorting order (ASC or DESC) as values.
 * @param params.limit - The maximum number of rows to return.
 * @param params.ctes - An array of common table expressions (CTEs) to include in the query.
 * @param params.alias - An optional alias for the resulting query.
 * @param formatSql - A boolean indicating whether to format the SQL query string. Defaults to false.
 *
 * @returns The constructed SQL query string.
 * @throws Error when the table name is not provided.
 */
export const buildSqlQuery = (
  params: SqlStatementParams,
  formatSql: boolean = false,
): string => {
  if (!params.table) {
    throw new Error('Table name is required.');
  }

  // Function to build CTEs
  const buildCtes = (ctes: Array<{name: string; value: string}>): string => {
    return ctes
      .map((cte, index) => {
        return index === 0
          ? `WITH ${cte.name} as (${cte.value})`
          : `, ${cte.name} AS (${cte.value})`;
      })
      .join('');
  };

  // Build Query Components
  const columnsToSelect = (params.selectColumns || ['*']).join(', ');
  const selectString = `SELECT ${columnsToSelect} FROM ${params.table}`;
  const joinString = params.joins ? buildJoinClause(params.joins) : '';
  const whereConditions =
    params.whereConditions && Object.keys(params.whereConditions).length
      ? buildWhereClause(params.whereConditions)
      : '';
  const whereString = whereConditions ? `WHERE ${whereConditions}` : '';
  const groupbyString = params.groupby
    ? `GROUP BY ${params.groupby.join(', ')}`
    : '';
  const orderByString = params.orderConditions
    ? `ORDER BY ${Object.entries(params.orderConditions)
        .map(([column, order]) => `${column} ${order}`)
        .join(', ')}`
    : '';
  const limitString = params.limit ? `LIMIT ${params.limit}` : '';

  // Build CTEs
  const cteString = params.ctes ? buildCtes(params.ctes) : '';

  // Build full query from components
  let sqlStatement = `${[
    selectString,
    joinString,
    whereString,
    groupbyString,
    orderByString,
    limitString,
  ]
    .filter(string => string)
    .join(' ')}`;

  if (cteString) {
    sqlStatement = `${cteString} ${sqlStatement}`;
  } else if (params.alias) {
    sqlStatement = `${sqlStatement} AS ${params.alias};`;
  }
  return formatSql ? format(sqlStatement) : sqlStatement;
};
