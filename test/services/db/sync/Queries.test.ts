// Functions
import {
  getLastSyncedForTableQuery,
  getRowsToSyncPushQuery,
  getRowByIdQuery,
} from '@services/db/sync/Queries';

// Constants
import {syncDbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/Enums';
import {timestampFields} from '@shared/Constants';

// Test Objects
import {
  sampleUpdatedAtTimestamp,
  sampleCreatedAtTimestamp,
  sampleSyncStartTimestamp,
} from './Objects';

describe('Sync Queries Tests', () => {
  test('getLastSyncedForTableQuery returns proper query string', () => {
    // Arrange
    // Act
    const response = getLastSyncedForTableQuery(
      syncDbTables.bodyStatTable,
      SyncType.Pull,
    );
    // Assert
    expect(response).toEqual(`
  SELECT last_synced, sync_operation
  FROM sync_table
  WHERE table_name = '${syncDbTables.bodyStatTable}' AND sync_type = '${SyncType.Pull}' ORDER BY sync_operation;`);
  });

  test(`getRowsToSyncPushQuery returns proper query string for ${SyncOperation.Creates}`, () => {
    // Arrange
    // Act
    const response = getRowsToSyncPushQuery(
      syncDbTables.bodyStatTable,
      SyncOperation.Creates,
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      sampleSyncStartTimestamp,
    );
    // Assert
    expect(response).toEqual(`
  SELECT *
  FROM ${syncDbTables.bodyStatTable}
  WHERE ${timestampFields.createdAt} > '${sampleCreatedAtTimestamp}' AND ${timestampFields.createdAt} <= '${sampleSyncStartTimestamp}' ORDER BY ${timestampFields.createdAt} ASC LIMIT 100;`);
  });

  test(`getRowsToSyncPushQuery returns proper query string for ${SyncOperation.Updates}`, () => {
    // Arrange
    // Act
    const response = getRowsToSyncPushQuery(
      syncDbTables.bodyStatTable,
      SyncOperation.Updates,
      sampleCreatedAtTimestamp,
      sampleUpdatedAtTimestamp,
      sampleSyncStartTimestamp,
    );
    // Assert
    expect(response).toEqual(`
  SELECT *
  FROM ${syncDbTables.bodyStatTable}
  WHERE ${timestampFields.updatedAt} > '${sampleUpdatedAtTimestamp}' AND ${timestampFields.createdAt} <= '${sampleCreatedAtTimestamp}' AND ${timestampFields.updatedAt} <= '${sampleSyncStartTimestamp}' ORDER BY ${timestampFields.updatedAt} ASC LIMIT 100;`);
  });

  test('getRowByIdQuery returns correct query string', () => {
    // Arrange
    const idColumn: string = 'idColumn';
    const fakeUuid: string = 'fakeUuid';
    // Act
    const response = getRowByIdQuery(
      syncDbTables.bodyStatTable,
      fakeUuid,
      idColumn,
    );
    // Assert
    expect(response).toEqual(
      `SELECT * FROM ${syncDbTables.bodyStatTable} WHERE ${idColumn} = '${fakeUuid}';`,
    );
  });
});
