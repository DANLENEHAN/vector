import {
  BaseOperators,
  BooleanOperators,
  StringOperators,
  NumericOperators,
} from '@services/api/swagger/data-contracts';

export const OperatorMap: Record<
  BaseOperators | BooleanOperators | NumericOperators,
  string
> = {
  [BaseOperators.Eq]: '=',
  [BaseOperators.Ne]: '!=',
  [BaseOperators.In]: 'IN',
  [BaseOperators.NotIn]: 'NOT IN',
  [BaseOperators.Isnull]: 'IS NULL',
  [BaseOperators.Notnull]: 'IS NOT NULL',
  [BooleanOperators.Isfalse]: '= 0',
  [BooleanOperators.Istrue]: '= 1',
  [NumericOperators.Lt]: '<',
  [NumericOperators.Le]: '<=',
  [NumericOperators.Gt]: '>',
  [NumericOperators.Ge]: '>=',
};

export const StringOperatorMap: Record<StringOperators, CallableFunction> = {
  [StringOperators.Contains]: (subStr: any) => `LIKE '%${subStr}%'`,
  [StringOperators.Like]: (subStr: any) => `LIKE '%${subStr}%'`,
  [StringOperators.Startswith]: (subStr: any) => `LIKE '${subStr}%'`,
  [StringOperators.Endswith]: (subStr: any) => `LIKE '%${subStr}'`,
};
