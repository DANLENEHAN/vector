export const revisionID = 'e7c94fe96676';

export const sqlCommands_20240201144009134837_e7c94fe96676: string[] = [
  `CREATE TABLE mood_tag_link (
	    mood_tag_link_id VARCHAR(36) NOT NULL,
	    mood_id VARCHAR(36) NOT NULL,
	    mood_tag_id VARCHAR(36) NOT NULL,
	    created_at TIMESTAMP NOT NULL,
	    updated_at TIMESTAMP,
	    timezone VARCHAR(100) NOT NULL,
	    deleted BOOLEAN DEFAULT false NOT NULL,
	    PRIMARY KEY (mood_tag_link_id),
	    FOREIGN KEY(mood_id) REFERENCES mood (mood_id),
	    FOREIGN KEY(mood_tag_id) REFERENCES mood_tag (mood_tag_id)
	);`,
  'ALTER TABLE equipment ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE exercise ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE plan ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE plan_component ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE set_ ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE set_component ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE user_account ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE workout ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  'ALTER TABLE workout_component ADD COLUMN deleted BOOLEAN DEFAULT false NOT NULL;',
  "UPDATE alembic_version SET version_num='e7c94fe96676' WHERE alembic_version.version_num = '3cb83104785d';",
];
