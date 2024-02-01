export const revisionID = '52720eed4c8f';

export const sqlCommands_20240201144009460700_52720eed4c8f: string[] = [
  'ALTER TABLE mood ADD COLUMN value INTEGER NOT NULL;',
  'ALTER TABLE mood ADD COLUMN label VARCHAR(50) NOT NULL;',
  'ALTER TABLE mood DROP COLUMN mood_value;',
  'ALTER TABLE mood DROP COLUMN mood_label;',
  "UPDATE alembic_version SET version_num='52720eed4c8f' WHERE alembic_version.version_num = 'e7c94fe96676';",
];
