// Functions
import * as DbFunctions from '@services/db/Functions';
import * as SqlClientFuncs from '@services/db/SqlClient';

// Test Objects
import {sampleStat} from '../../Objects';

// Types
import {syncDbTables} from '@shared/Constants';

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('insertRows works with array of data', async () => {
    // Arrange
    const columns = Object.keys(sampleStat);
    const placeholders = columns.map(_ => '?').join(', ');
    const params = [sampleStat, sampleStat];
    const sqlStatement = `INSERT INTO ${
      syncDbTables.bodyStatTable
    } (${columns.join(', ')}) VALUES (${placeholders});`;

    const executeSqlBatchRes = {
      originalQuery: {
        sqlStatement: sqlStatement,
        params: params,
      },
      result: [],
    };

    jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([executeSqlBatchRes, executeSqlBatchRes]);

    // Act
    const response = await DbFunctions.insertRows(
      syncDbTables.bodyStatTable,
      params,
    );

    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
    expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([
      {
        sqlStatement: sqlStatement,
        params: Object.values(sampleStat),
      },
      {
        sqlStatement: sqlStatement,
        params: Object.values(sampleStat),
      },
    ]);
    expect(response).toEqual(undefined);
  });

  test('insertRows should throw if given now data', async () => {
    try {
      await DbFunctions.insertRows(syncDbTables.bodyStatTable, []);
      fail('Function did not throw as expected');
    } catch (error: any) {
      expect(error.message).toBe('No data to insert.');
    }
  });
});
