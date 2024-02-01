export const revisionID = '4fe984a654e7';

export const sqlCommands_20240201144010440424_4fe984a654e7: string[] = [
  `CREATE TABLE body_stat (
	    body_stat_id VARCHAR(36) NOT NULL,
	    user_id INTEGER NOT NULL,
	    value FLOAT NOT NULL,
	    unit VARCHAR(25) NOT NULL,
	    stat_type VARCHAR(50) NOT NULL,
	    note VARCHAR(200),
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    deleted BOOLEAN DEFAULT false NOT NULL,
	    PRIMARY KEY (body_stat_id),
	    FOREIGN KEY(user_id) REFERENCES user_account (user_id)
	);`,
  'DROP TABLE stat;',
  "UPDATE alembic_version SET version_num='4fe984a654e7' WHERE alembic_version.version_num = '43f4f78aa491';",
];
