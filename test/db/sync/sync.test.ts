// Test Objects
import {sampleStat, sampleTimestampOne, sampleSyncRow} from '../../objects';

// Functions
import {
  convertListToSyncUpdateSchemas,
  getLastSyncedForTable,
  getRowsToSync,
  insertSyncUpdate,
} from '@services/db/sync/functions';

// Types
import {dbTables} from '@shared/contants';
import {SyncOperation, SyncType} from '@shared/enums';
import {runSqlSelect, executeSqlNonQuery} from '@services/db/functions';
import {StatCreateSchema} from '@services/api/swagger/data-contracts';

// Global Mocks

jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
  })),
}));

jest.mock('@services/db/functions', () => ({
  runSqlSelect: jest.fn(),
  executeSqlNonQuery: jest.fn(),
}));

describe('Sync Tests', () => {
  test('should convert list of SyncCreateSchemas to SyncUpdateSchemas', () => {
    // Arrange
    const createSchemasList = [sampleStat];
    // Act
    const result = convertListToSyncUpdateSchemas(createSchemasList);
    // Assert
    expect(result).toHaveLength(createSchemasList.length);
    result.forEach((updateSchema: any, index: any) => {
      expect(updateSchema).toEqual(
        expect.objectContaining({
          updated_at: createSchemasList[index].updated_at,
          unit: createSchemasList[index].unit,
        }),
      );
      expect(updateSchema.created_at).toBeUndefined();
      expect(updateSchema.timezone).toBeUndefined();
      expect(updateSchema.stat_id).toBeDefined();
    });
  });

  test('getLastSyncedForTable parses non-null response', async () => {
    // Arrange
    const last_synced: string = sampleTimestampOne;
    const mockedRunSqlSelect = jest.mocked(runSqlSelect);
    mockedRunSqlSelect.mockReturnValueOnce(
      Promise.resolve([{last_synced: last_synced}]),
    );
    // Act
    const result = await getLastSyncedForTable(
      dbTables.statTable,
      SyncType.Push,
      SyncOperation.Creates,
    );
    // Assert
    expect(result).toEqual(last_synced);
  });

  test('getLastSyncedForTable parses null response', async () => {
    // Arrange
    const last_synced: null = null;
    const mockedRunSqlSelect = jest.mocked(runSqlSelect);
    mockedRunSqlSelect.mockReturnValueOnce(
      Promise.resolve([{last_synced: last_synced}]),
    );
    // Act
    const result = await getLastSyncedForTable(
      dbTables.statTable,
      SyncType.Pull,
      SyncOperation.Updates,
    );
    // Assert
    expect(result).toEqual(last_synced);
  });

  test('getLastSyncedForTable handles empty array', async () => {
    // Arrange
    const mockedRunSqlSelect = jest.mocked(runSqlSelect);
    mockedRunSqlSelect.mockReturnValueOnce(Promise.resolve([]));
    // Act
    const result = await getLastSyncedForTable(
      dbTables.statTable,
      SyncType.Pull,
      SyncOperation.Creates,
    );
    // Assert
    expect(result).toEqual(null);
  });

  test('getRowsToSync handles non empty response', async () => {
    // Arrange
    const sampleResponse: StatCreateSchema[] = [sampleStat, sampleStat];
    const mockedRunSqlSelect = jest.mocked(runSqlSelect);
    mockedRunSqlSelect.mockReturnValueOnce(Promise.resolve(sampleResponse));
    // Act
    const result = await getRowsToSync(
      dbTables.statTable,
      SyncOperation.Creates,
      sampleTimestampOne,
    );
    // Assert
    expect(result).toEqual(sampleResponse);
  });

  test('getRowsToSync handles empty response', async () => {
    // Arrange
    const sampleResponse: StatCreateSchema[] = [];
    const mockedRunSqlSelect = jest.mocked(runSqlSelect);
    mockedRunSqlSelect.mockReturnValueOnce(Promise.resolve(sampleResponse));
    // Act
    const result = await getRowsToSync(
      dbTables.statTable,
      SyncOperation.Creates,
      sampleTimestampOne,
    );
    // Assert
    expect(result).toEqual(sampleResponse);
  });

  test('insertSyncUpdate throws error for unsucessful insert', async () => {
    // Arrange
    const response: number = 0;
    const sampleSyncUpdate = sampleSyncRow;
    const mockedRunSqlSelect = jest.mocked(executeSqlNonQuery);
    mockedRunSqlSelect.mockReturnValueOnce(Promise.resolve(response));
    // Act
    // Assert
    await expect(insertSyncUpdate(sampleSyncUpdate)).rejects.toThrow(
      `Failed to insert or replace SyncUpdate. No ${response} rows affected.`,
    );
  });
});
