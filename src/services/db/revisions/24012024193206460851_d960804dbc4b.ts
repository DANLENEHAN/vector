export const revisionID = 'd960804dbc4b';

export const sqlCommands_24012024193206460851_d960804dbc4b: string[] = [
  `CREATE TABLE sync_error_dump (
	    id INTEGER NOT NULL,
	    table_name VARCHAR(100) NOT NULL,
	    row_id VARCHAR(36) NOT NULL,
	    data JSON NOT NULL,
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    PRIMARY KEY (id)
	);`,
  "UPDATE alembic_version SET version_num='d960804dbc4b' WHERE alembic_version.version_num = '01b72a8d1240';",
];
