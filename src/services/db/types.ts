export const dbName = 'vector.db';

export const alembicTable: string = 'alembic_version';

export interface RevisionCallback {
  (revisionId: string | null): void;
}

export interface RowData {
  [key: string]: any;
}
