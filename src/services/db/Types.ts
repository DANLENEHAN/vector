export const dbName = 'vector.db';

export const alembicTable: string = 'alembic_version';

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
  originalQuery: {sqlStatement: string; params?: any[]};
  result?: T;
  error?: string;
}

export interface SqlQuery {
  /**
   * SQL statement to be executed.
   */
  sqlStatement: string;
  params?: any[];
}
