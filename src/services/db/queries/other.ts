export const generateDeletionQuery: string = `
	SELECT 'DROP TABLE IF EXISTS ' || name || ';'
	FROM sqlite_master
	WHERE type = 'table' AND name != 'android_metadata';
`;
