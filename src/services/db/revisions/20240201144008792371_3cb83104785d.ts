export const revisionID = '3cb83104785d';

export const sqlCommands_20240201144008792371_3cb83104785d: string[] = [
  `CREATE TABLE mood_tag (
	    mood_tag_id VARCHAR(36) NOT NULL,
	    user_id INTEGER NOT NULL,
	    deleted BOOLEAN DEFAULT false NOT NULL,
	    label VARCHAR(100) NOT NULL,
	    category VARCHAR(100) NOT NULL,
	    icon VARCHAR(50) NOT NULL,
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    PRIMARY KEY (mood_tag_id),
	    FOREIGN KEY(user_id) REFERENCES user_account (user_id)
	);`,
  "UPDATE alembic_version SET version_num='3cb83104785d' WHERE alembic_version.version_num = '25a0638117a1';",
];
