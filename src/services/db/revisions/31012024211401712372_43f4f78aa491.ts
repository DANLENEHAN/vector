export const revisionID = '43f4f78aa491';

export const sqlCommands_31012024211401712372_43f4f78aa491: string[] = [
  `CREATE TABLE client_session_event (
	    client_session_event_id VARCHAR(36) NOT NULL,
	    user_id INTEGER NOT NULL,
	    client_type VARCHAR(50) NOT NULL,
	    event_type VARCHAR(100) NOT NULL,
	    brand VARCHAR(50),
	    device_id VARCHAR(100),
	    system_version VARCHAR(50),
	    user_agent VARCHAR(500),
	    application_version VARCHAR(50),
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    deleted BOOLEAN DEFAULT false NOT NULL,
	    PRIMARY KEY (client_session_event_id),
	    FOREIGN KEY(user_id) REFERENCES user_account (user_id)
	);`,
  "UPDATE alembic_version SET version_num='43f4f78aa491' WHERE alembic_version.version_num = 'd6950f48b44b';",
];
