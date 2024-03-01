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

const getQueryCondition = (
  columnName: string,
  columnValue: moment.Moment | number | string | Array<number | string>,
  operator: QueryOperators,
): string => {
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
      throw Error('operator for timestamp columm incorrect');
    }
    if (isMoment(columnValue)) {
      transformedColumnName = `datetime(${columnName})`;
      transformedColumnValue = `'${momentToDateStr(
        fromDateTzToDateTz(columnValue, deviceTimezone(), 'UTC'),
        TimestampFormat.YYYYMMDDHHMMss,
      )}'`;
      return `${transformedColumnName} ${
        OperatorMap[operator as BaseOperators | NumericOperators]
      } ${transformedColumnValue}`;
    } else {
      throw Error('Date value must be a single moment.Moment');
    }
  }

  // Handling Boolean and Null checks
  else if (
    isInEnum(BooleanOperators, operator) ||
    operator === BaseOperators.Isnull ||
    operator === BaseOperators.Notnull
  ) {
    if (columnValue !== null) {
      throw Error('Boolean and Null checks cannot include a non null value');
    }
    return `${columnName} ${
      OperatorMap[operator as BooleanOperators | BaseOperators]
    }`;
  }

  // Handling Number Values
  else if (typeof columnValue === 'number') {
    if (
      !isInEnum(BaseOperators, operator) &&
      !isInEnum(NumericOperators, operator)
    ) {
      throw Error('operator for number value incorrect');
    }
    return `${columnName} ${
      OperatorMap[operator as BaseOperators | NumericOperators]
    } ${columnValue}`;
  }

  // Handling String Values
  else if (typeof columnValue === 'string') {
    if (
      !isInEnum(BaseOperators, operator) &&
      !isInEnum(NumericOperators, operator) &&
      !isInEnum(StringOperators, operator)
    ) {
      throw Error('operator for string value incorrect');
    } else if (isInEnum(StringOperators, operator)) {
      return `${columnName} ${StringOperatorMap[operator as StringOperators](
        columnValue,
      )}`;
    } else {
      return `${columnName} ${
        OperatorMap[operator as BaseOperators | NumericOperators]
      } '${columnValue}'`;
    }
  }

  // Handling Array Values
  else if (Array.isArray(columnValue)) {
    if (operator !== BaseOperators.NotIn && operator !== BaseOperators.In) {
      throw Error('operator for array value incorrect');
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
      return `${columnName} ${OperatorMap[operator]} ${transformedColumnValue}`;
    }
  } else {
    throw Error('Incorrect query');
  }
};

export const buildWhereClause = (obj: object) => {
  const conditions: any = [];
  for (const key in obj) {
    // If the key is a booleanOperator we must recursively call the function
    // and join the result on this booleanOperator key
    if (isInEnum(AndOrOperatos, key)) {
      const nestedCondition = buildWhereClause((obj as any)[key]).join(
        ` ${key} `,
      );
      conditions.push(`(${nestedCondition})`);
    } else {
      // If key is not a booleanOperator It's a column so gather the conditionals
      for (const [operator, value] of Object.entries((obj as any)[key])) {
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
          console.error('Invalid Query Structure.', operator);
        }
      }
    }
  }
  return conditions;
};
