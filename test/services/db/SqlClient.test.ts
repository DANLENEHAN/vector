// Functions
import * as SqlClientFuncs from '@services/db/SqlClient';

const successSql = 'successSql';
const failureSql = 'failureSql';

jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(callback => {
      const tx = {
        executeSql: jest
          .fn()
          .mockImplementation(
            (sqlStatement, params, successCallBack, errorCallback) => {
              if (sqlStatement === 'successSql') {
                successCallBack(null, {
                  rows: {
                    item: jest.fn().mockImplementation(idx => {
                      const response: any = {
                        0: {
                          col1: 'val1',
                          col2: 'val2',
                        },
                      };
                      return response[idx];
                    }),
                    length: 1,
                  },
                });
              } else {
                errorCallback({
                  message: 'Your SQL is shit',
                });
              }
            },
          ),
      };
      callback(tx);
    }),
  })),
}));

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test(`executeSqlBatch successful sql execution`, async () => {
    const response = await SqlClientFuncs.executeSqlBatch([
      {
        sqlStatement: successSql,
      },
    ]);

    expect(response).toEqual([
      {
        error: null,
        originalQuery: {params: undefined, sqlStatement: successSql},
        result: [
          {
            col1: 'val1',
            col2: 'val2',
          },
        ],
      },
    ]);
  });

  test(`executeSqlBatch unsuccessful sql execution`, async () => {
    const response = await SqlClientFuncs.executeSqlBatch([
      {
        sqlStatement: failureSql,
      },
    ]);

    expect(response).toEqual([
      {
        error: `Execution failed with error: 'Your SQL is shit'`,
        originalQuery: {params: undefined, sqlStatement: failureSql},
        result: [],
      },
    ]);
  });

  test(`executeSqlBatch successful and unsuccessful sql execution`, async () => {
    const response = await SqlClientFuncs.executeSqlBatch([
      {
        sqlStatement: successSql,
      },
      {
        sqlStatement: failureSql,
      },
    ]);

    expect(response).toEqual([
      {
        error: null,
        originalQuery: {params: undefined, sqlStatement: successSql},
        result: [
          {
            col1: 'val1',
            col2: 'val2',
          },
        ],
      },
      {
        error: `Execution failed with error: 'Your SQL is shit'`,
        originalQuery: {params: undefined, sqlStatement: failureSql},
        result: [],
      },
    ]);
  });
});
