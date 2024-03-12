import {
  BaseOperators,
  BooleanOperators,
  StringOperators,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
import {SortOrders, syncDbTables, otherDbTables} from '@shared/Constants';
import {JoinOperators} from './Constants';

/**
 * Interface for a row data object.
 *
 * @interface RowData
 *
 * @param key The key for the row data object.
 * @param value The value for the row data object.
 */
export interface RowData {
  [key: string]: any;
}

export interface ExecutionResult<T> {
  /**
   * Original SQL statement and parameters associated with this execution.
   */
  originalQuery: {sqlStatement: string; params?: RowData[]};
  result: T[];
  error: string | null;
}

export interface SqlQuery {
  /**
   * SQL statement to be executed.
   */
  sqlStatement: string;
  params?: any[];
}

export type QueryOperators =
  | BaseOperators
  | BooleanOperators
  | NumericOperators
  | StringOperators;

export interface JoinObject {
  join: JoinOperators;
  on: Record<string, any>;
}
export interface GetRowsParams {
  tableName: syncDbTables | otherDbTables;
  selectColumns?: Array<string>;
  joins?: Partial<Record<syncDbTables | otherDbTables, JoinObject>>;
  groupby?: Array<string>;
  whereConditions?: Record<string, any>;
  orderConditions?: Record<string, SortOrders>;
  limit?: number;
}

export interface Literal {
  isLiteral: boolean;
  value: string;
}
