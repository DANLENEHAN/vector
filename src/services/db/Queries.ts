/**
 * Generate a SQL query to drop all tables in the SQLite database except for the system table 'android_metadata'.
 *
 * @type {string}
 */
export const generateDeletionQuery: string = `
    SELECT 'DROP TABLE IF EXISTS ' || name || ';'
    FROM sqlite_master
    WHERE type = 'table' AND name != 'android_metadata';
`;
