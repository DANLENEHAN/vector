// Functions
import * as SqlClientFuncs from '@services/db/SqlClient';
import {syncDbTables} from '@shared/Constants';
import {sampleUser} from '../../../Objects';
import {getUser, insertUser} from '@services/db/user/Functions';
import * as DbFunctions from '@services/db/Operations';
import logger from '@utils/Logger';

describe('Test User Db Functions', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const getUserMockSql = `SELECT * FROM ${syncDbTables.userTable} LIMIT 1;`;

  test('getUser - executeSqlBatch returns valid response ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getUserMockSql,
          },
          result: [sampleUser],
          error: null,
        },
      ]);

    const response = await getUser();

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getUserMockSql},
    ]);

    expect(response).toEqual(sampleUser);
  });

  test('getUser - executeSqlBatch returns null ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getUserMockSql,
          },
          result: [],
          error: null,
        },
      ]);

    const response = await getUser();

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getUserMockSql},
    ]);

    expect(response).toEqual(null);
  });

  test('getUser - executeSqlBatch returns error ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getUserMockSql,
          },
          result: [],
          error: 'Error!',
        },
      ]);

    const response = await getUser();

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getUserMockSql},
    ]);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `Unable to get user with error: Error!`,
    );
    expect(response).toEqual(null);
  });

  test('getUser - executeSqlBatch returns db not up error ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getUserMockSql,
          },
          result: [],
          error: 'no such table: user',
        },
      ]);

    const response = await getUser();

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getUserMockSql},
    ]);
    expect(response).toEqual(null);
  });

  test('insertUser called insertRows', async () => {
    // Arrange
    const insertRowsSpy = jest
      .spyOn(DbFunctions, 'insertRows')
      .mockResolvedValueOnce();

    // Act
    const response = await insertUser(sampleUser);

    // Assert
    expect(insertRowsSpy).toHaveBeenCalledTimes(1);
    expect(insertRowsSpy).toHaveBeenCalledWith(syncDbTables.userTable, [
      {...sampleUser, superuser: false},
    ]);
    expect(response).toEqual(undefined);
  });
});
