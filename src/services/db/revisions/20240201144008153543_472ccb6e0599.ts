export const revisionID = '472ccb6e0599';

export const sqlCommands_20240201144008153543_472ccb6e0599: string[] = [
  `CREATE TABLE sync_error_dump (
	    id INTEGER NOT NULL,
	    table_name VARCHAR(100) NOT NULL,
	    row_id VARCHAR(36) NOT NULL,
	    sync_operation VARCHAR(25) NOT NULL,
	    sync_type VARCHAR(25) NOT NULL,
	    data JSON NOT NULL,
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    PRIMARY KEY (id)
	);`,
  "UPDATE alembic_version SET version_num='472ccb6e0599' WHERE alembic_version.version_num = '01b72a8d1240';",
];
