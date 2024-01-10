export const revisionID = '4770c0c95563';

export const sqlCommands_08012024171011543765_4770c0c95563: string[] = [
  `-- Removed superuser insert but keeping revision to keep front and backend DBs in sync
	UPDATE alembic_version SET version_num='4770c0c95563' WHERE alembic_version.version_num = '8f5c9144791d';`,
];
