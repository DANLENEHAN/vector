// Functions
import * as SqlClientFuncs from '@services/db/SqlClient';
import {syncDbTables} from '@shared/Constants';
import {sampleDeviceRow} from '../../../Objects';
import {getDevice, insertDevice} from '@services/db/device/Functions';
import * as DbFunctions from '@services/db/Operations';
import logger from '@utils/Logger';

describe('Test Device Db Functions', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  const fakeUserId = 'fakeUserId';
  const fakeDeviceId = 'fakeDeviceId';
  const getDeviceMockSql =
    `SELECT * FROM ${syncDbTables.deviceTable} ` +
    `WHERE device_internal_id = '${fakeDeviceId}' ` +
    `AND user_id = '${fakeUserId}';`;

  test('getDevice - executeSqlBatch returns valid response ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getDeviceMockSql,
          },
          result: [sampleDeviceRow],
          error: null,
        },
      ]);

    const response = await getDevice(fakeDeviceId, fakeUserId);

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getDeviceMockSql},
    ]);

    expect(response).toEqual(sampleDeviceRow);
  });

  test('getDevice - executeSqlBatch returns null ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getDeviceMockSql,
          },
          result: [],
          error: null,
        },
      ]);

    const response = await getDevice(fakeDeviceId, fakeUserId);

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getDeviceMockSql},
    ]);

    expect(response).toEqual(null);
  });

  test('getDevice - executeSqlBatch returns error ', async () => {
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce([
        {
          originalQuery: {
            sqlStatement: getDeviceMockSql,
          },
          result: [],
          error: 'Error!',
        },
      ]);

    const response = await getDevice(fakeDeviceId, fakeUserId);

    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([
      {sqlStatement: getDeviceMockSql},
    ]);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      `Unable to get Device with error: Error!`,
    );
    expect(response).toEqual(null);
  });

  test('insertDevice called insertRows', async () => {
    // Arrange
    const insertRowsSpy = jest
      .spyOn(DbFunctions, 'insertRows')
      .mockResolvedValueOnce();

    // Act
    const response = await insertDevice(sampleDeviceRow);

    // Assert
    expect(insertRowsSpy).toHaveBeenCalledTimes(1);
    expect(insertRowsSpy).toHaveBeenCalledWith(syncDbTables.deviceTable, [
      sampleDeviceRow,
    ]);
    expect(response).toEqual(undefined);
  });
});
