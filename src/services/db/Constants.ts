import {
  BaseOperators,
  BooleanOperators,
  StringOperators,
  NumericOperators,
} from '@services/api/swagger/data-contracts';

export const alembicTable: string = 'alembic_version';

/**
 * Maps various operator types (base, boolean, numeric) to their corresponding SQL string representations.
 *
 * This record object, `OperatorMap`, serves as a comprehensive mapping between the application's
 * abstracted operator types and their SQL equivalents. It includes mappings for base comparison
 * operators (e.g., equality, inequality), boolean operators (e.g., true, false), and numeric
 * operators (e.g., less than, greater than). This utility facilitates the dynamic generation of SQL
 * queries based on abstract conditions, enhancing the flexibility and readability of database
 * interaction logic within the application.
 *
 * The keys are enums or constants representing different types of operators, and the values are
 * strings that represent how these operators are denoted in SQL syntax. This mapping is essential
 * for constructing SQL queries programmatically, ensuring that the application's logic for data
 * filtering and retrieval is accurately translated into valid SQL queries.
 */
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

/**
 * Maps string operator types to their corresponding SQL LIKE clause generator functions.
 *
 * `StringOperatorMap` is a record that associates string manipulation operations, such as
 * containment checks, prefix/suffix matching, with functions that generate the appropriate SQL
 * LIKE clauses. Each function takes a substring as input and returns a SQL LIKE clause string
 * tailored to perform the specified string operation. This mapping facilitates the construction
 * of dynamic SQL queries involving string conditions, making it easier to implement search
 * features and other string-based data filtering logic within the application.
 *
 * The keys of the record are enums representing different string operations, and the values are
 * functions that take a substring argument and return a SQL clause. This approach allows for
 * a high degree of flexibility and reuse in query construction, supporting efficient and
 * expressive database interactions.
 */
export const StringOperatorMap: Record<StringOperators, CallableFunction> = {
  [StringOperators.Contains]: (subStr: any) => `LIKE '%${subStr}%'`,
  [StringOperators.Like]: (subStr: any) => `LIKE '%${subStr}%'`,
  [StringOperators.Startswith]: (subStr: any) => `LIKE '${subStr}%'`,
  [StringOperators.Endswith]: (subStr: any) => `LIKE '%${subStr}'`,
};
