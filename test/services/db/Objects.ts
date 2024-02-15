export const generateDeletionQueryResponse = [
  {
    "'DROP TABLE IF EXISTS ' || name || ';'":
      'DROP TABLE IF EXISTS alembic_version;',
  },
  {"'DROP TABLE IF EXISTS ' || name || ';'": 'DROP TABLE IF EXISTS bodypart;'},
];
