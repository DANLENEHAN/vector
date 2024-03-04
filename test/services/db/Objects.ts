import moment from 'moment-timezone';

export const generateDeletionQueryResponse = [
  {
    "'DROP TABLE IF EXISTS ' || name || ';'":
      'DROP TABLE IF EXISTS alembic_version;',
  },
  {"'DROP TABLE IF EXISTS ' || name || ';'": 'DROP TABLE IF EXISTS bodypart;'},
];

export const sampleTimeStamp = '2024-02-29T04:00:00.000';
export const timezone = 'America/Toronto';
export const sampleMoment = moment.tz(sampleTimeStamp, timezone);

export const sampleWhereConditionsFlatObject = {
  numberCol: {
    eq: 20,
    le: 30,
  },
  stringCol: {
    eq: 10,
    le: 20,
  },
};

export const sampleWhereConditionsNestedObject = {
  or: {
    and: {
      or: {
        created_at: {
          eq: sampleMoment,
          le: sampleMoment,
        },
        updated_at: {
          eq: sampleMoment,
          le: sampleMoment,
        },
      },
      numberColumn: {
        eq: 10,
      },
      stringColumn: {
        eq: '2',
      },
    },
    arrayColumn: {
      in: ['10', 2, 3, '62'],
    },
  },
};
