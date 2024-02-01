export const revisionID = 'd6950f48b44b';

export const sqlCommands_20240201144009791189_d6950f48b44b: string[] = [
  `CREATE TABLE nutrition (
	    nutrition_id VARCHAR(36) NOT NULL,
	    user_id INTEGER NOT NULL,
	    value FLOAT NOT NULL,
	    unit VARCHAR(25) NOT NULL,
	    type VARCHAR(50) NOT NULL,
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    deleted BOOLEAN DEFAULT false NOT NULL,
	    PRIMARY KEY (nutrition_id),
	    FOREIGN KEY(user_id) REFERENCES user_account (user_id)
	);`,
  "UPDATE alembic_version SET version_num='d6950f48b44b' WHERE alembic_version.version_num = '52720eed4c8f';",
];
