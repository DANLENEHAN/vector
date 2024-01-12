export const dbName = 'vector.db';

export const alembicTable: string = 'alembic_version';

/**
 * Interface for a revision callback function.
 *
 * @interface RevisionCallback
 *
 * @param revisionId The revision ID retrieved from the database.
 */
export interface RevisionCallback {
  (revisionId: string | null): void;
}

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
