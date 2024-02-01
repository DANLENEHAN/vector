export const revisionID = '25a0638117a1';

export const sqlCommands_20240201144008475267_25a0638117a1: string[] = [
  `CREATE TABLE mood (
	    mood_id VARCHAR(36) NOT NULL,
	    user_id INTEGER NOT NULL,
	    mood_value INTEGER NOT NULL,
	    mood_label VARCHAR(50) NOT NULL,
	    note VARCHAR(500),
	    deleted BOOLEAN DEFAULT false NOT NULL,
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    PRIMARY KEY (mood_id),
	    FOREIGN KEY(user_id) REFERENCES user_account (user_id)
	);`,
  "UPDATE alembic_version SET version_num='25a0638117a1' WHERE alembic_version.version_num = '472ccb6e0599';",
];
