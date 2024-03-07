// Functions
import * as SqlClientFuncs from '@services/db/SqlClient';

const successSql = 'successSql';
const failureSql = 'failureSql';

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const mock = jest.fn(() => ({
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
  }));

  const openDatabaseSpy = jest
    .spyOn(SqlClientFuncs.dbConnectionManager, 'getDB')
    .mockImplementation(mock as any);

  test(`executeSqlBatch successful sql execution`, async () => {
    // Arrange
    // Act
    const response = await SqlClientFuncs.executeSqlBatch([
      {
        sqlStatement: successSql,
      },
    ]);

    // Assert
    expect(openDatabaseSpy).toHaveBeenCalledTimes(2);
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
    // Arrange
    // Act
    const response = await SqlClientFuncs.executeSqlBatch([
      {
        sqlStatement: failureSql,
      },
    ]);

    // Assert
    expect(openDatabaseSpy).toHaveBeenCalledTimes(2);
    expect(response).toEqual([
      {
        error: `Execution failed with error: 'Your SQL is shit'`,
        originalQuery: {params: undefined, sqlStatement: failureSql},
        result: [],
      },
    ]);
  });

  test(`executeSqlBatch successful and unsuccessful sql execution`, async () => {
    // Arrange
    // Act
    const response = await SqlClientFuncs.executeSqlBatch([
      {
        sqlStatement: successSql,
      },
      {
        sqlStatement: failureSql,
      },
    ]);

    // Assert
    expect(openDatabaseSpy).toHaveBeenCalledTimes(2);
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
