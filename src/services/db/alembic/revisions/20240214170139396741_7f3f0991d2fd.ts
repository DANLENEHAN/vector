export const revisionID = '7f3f0991d2fd';

export const sqlCommands_20240214170139396741_7f3f0991d2fd: string[] = [
  'ALTER TABLE sync_error_dump ALTER COLUMN timezone DROP NOT NULL;',
  "UPDATE alembic_version SET version_num='7f3f0991d2fd' WHERE alembic_version.version_num = 'b5cb75bf8cc0';",
];
