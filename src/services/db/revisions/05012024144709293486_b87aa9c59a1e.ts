export const revisionID = 'b87aa9c59a1e';

export const sqlCommands_05012024144709293486_b87aa9c59a1e: string[] = [
  'ALTER TABLE set ADD COLUMN sequence INTEGER NOT NULL;',
  'ALTER TABLE set_component ADD COLUMN sequence INTEGER NOT NULL;',
  'ALTER TABLE workout_component ADD COLUMN sequence INTEGER NOT NULL;',
  "UPDATE alembic_version SET version_num='b87aa9c59a1e' WHERE alembic_version.version_num = '01b72a8d1240';",
];
