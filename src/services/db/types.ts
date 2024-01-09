// Tables
export const alembicTable: string = 'alembic_version';

export interface RevisionCallback {
  (revisionId: string | null): void;
}
