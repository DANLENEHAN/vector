import moment, {isMoment} from 'moment-timezone';
import {QueryOperators} from '@services/db/Types';
import {OperatorMap, StringOperatorMap} from '@services/db/Constants';
import {
  BaseOperators,
  BooleanOperators,
  StringOperators,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
import {isInEnum} from '@shared/Functions';
import {timestampColumns, AndOrOperatos} from '@shared/Constants';
import {
  momentToDateStr,
  fromDateTzToDateTz,
  deviceTimezone,
} from '@services/date/Functions';
import {TimestampFormat} from '@shared/Enums';

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
const getQueryCondition = (
  columnName: string,
  columnValue: moment.Moment | number | string | Array<number | string>,
  operator: QueryOperators,
): string => {
  // Transformation variables with initial values identical to the input parameters.
  let transformedColumnName: string = columnName;
  let transformedColumnValue:
    | moment.Moment
    | number
    | string
    | Array<number | string> = columnValue;

  // Handling Timestamp Columns
  if (isInEnum(timestampColumns, columnName)) {
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
        fromDateTzToDateTz(columnValue, deviceTimezone(), 'UTC'),
        TimestampFormat.YYYYMMDDHHMMss,
      )}'`;
    } else {
      throw new Error(
        'Date value must be a moment.Moment object for timestamp columns.',
      );
    }
  }

  // Handling Boolean and Null checks
  else if (
    isInEnum(BooleanOperators, operator) ||
    operator === BaseOperators.Isnull ||
    operator === BaseOperators.Notnull
  ) {
    if (columnValue !== null) {
      throw new Error(
        'Boolean and Null checks must not include a column value.',
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
          if (typeof item === 'string') {
            return `'${item}'`;
          } else {
            return item;
          }
        })
        .join(', ');
      transformedColumnValue = `(${transformedArray})`;
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

export const buildWhereClause = (obj: any) => {
  const conditions: string[] = [];
  for (const key in obj) {
    // If the key is a booleanOperator we must recursively call the function
    // and join the result on this booleanOperator key
    if (isInEnum(AndOrOperatos, key)) {
      const nestedCondition = buildWhereClause(obj[key]).join(` ${key} `);
      conditions.push(`(${nestedCondition})`);
    } else {
      // If key is not a booleanOperator It's a column so gather the conditionals
      for (const [operator, value] of Object.entries(obj[key])) {
        if (
          isInEnum(BaseOperators, operator) ||
          isInEnum(BooleanOperators, operator) ||
          isInEnum(StringOperators, operator) ||
          isInEnum(NumericOperators, operator)
        ) {
          console.log(key, value, operator);
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
  return conditions;
};
