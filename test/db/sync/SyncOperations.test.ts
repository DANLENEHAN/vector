// Test Objects
import {sampleStat} from '../../objects';
import {SyncCreateSchemas} from '@services/db/sync/types';
import {dbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/enums';

// Functions
import {
  processUpdatesSyncTypePush,
  processCreatesSyncTypePush,
  processSyncTypePull,
} from '@services/db/sync/SyncOperations';
import {insertSyncUpdate} from '@services/db/sync/utils';
import {insertRows} from '@services/db/functions';

// Constants
import {apiFunctions} from '@services/db/sync/Constants';

/*
   Required when importing @services/db/sync/ProcessFunctions
   Mocking external dependencies
*/
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mocked/document/directory/path',
}));

jest.mock('uuid', () => ({
  uuidv4: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
}));

jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
  })),
}));
/**/

// Mocking the Stat Api Class
jest.mock('@services/api/swagger/Stat', () => ({
  Stat: jest.fn().mockImplementation(() => ({
    createCreate: jest.fn(),
    updateUpdate: jest.fn(),
    postStat: jest.fn().mockResolvedValue({
      // Should be the sampleStat var.
      // Probaly could be if defining mock in test worked...
      data: [
        {
          stat_id: '67f6127d-13cc-4c27-b91f-2b1f83c48eeb',
          stat_type: 'water',
          unit: 'ml',
          timezone: 'UTC',
          created_at: '2025-01-01T00:00:00.000',
          updated_at: '2025-01-01T00:01:00.000',
          user_id: 1,
          value: 500,
        },
      ],
    }),
  })),
}));

jest.mock('@services/db/sync/utils', () => ({
  ...jest.requireActual('@services/db/sync/utils'),
  insertSyncUpdate: jest.fn(),
  getLastSyncedForTable: jest.fn(),
  getQueryObjForTable: jest.fn(),
}));

jest.mock('@services/db/functions', () => ({
  ...jest.requireActual('@services/db/functions'),
  insertRows: jest.fn(),
  updateRows: jest.fn(),
}));

describe('Sync ProcessFunctions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processUpdatesSyncTypePush with one row', async () => {
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: dbTables = dbTables.statTable;

    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.updated_at,
      sync_operation: SyncOperation.Updates,
      sync_type: SyncType.Push,
      table_name: dbTables.statTable,
    });
  });

  test('processUpdatesSyncTypePush with no rows', async () => {
    const rowsToSync: SyncCreateSchemas[] = [];
    const tableToSync: dbTables = dbTables.statTable;

    await processUpdatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );
    expect(insertSyncUpdate).toHaveBeenCalledTimes(0);
  });

  test('processCreatesSyncTypePush with one row', async () => {
    const rowsToSync: SyncCreateSchemas[] = [sampleStat];
    const tableToSync: dbTables = dbTables.statTable;

    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.created_at,
      sync_operation: SyncOperation.Creates,
      sync_type: SyncType.Push,
      table_name: dbTables.statTable,
    });
  });

  test('processCreatesSyncTypePush with no rows', async () => {
    const rowsToSync: SyncCreateSchemas[] = [];
    const tableToSync: dbTables = dbTables.statTable;

    await processCreatesSyncTypePush(
      rowsToSync,
      tableToSync,
      apiFunctions[tableToSync],
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(0);
  });

  test("processSyncTypePull sync operation 'Creates'", async () => {
    const tableToSync: dbTables = dbTables.statTable;

    await processSyncTypePull(
      tableToSync,
      apiFunctions[tableToSync],
      SyncOperation.Creates,
    );

    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
    expect(insertSyncUpdate).toHaveBeenCalledWith({
      last_synced: sampleStat.created_at,
      sync_operation: SyncOperation.Creates,
      sync_type: SyncType.Pull,
      table_name: dbTables.statTable,
    });
    expect(insertRows).toHaveBeenCalledTimes(1);
    expect(insertRows).toHaveBeenCalledWith(
      dbTables.statTable,
      [sampleStat],
      false,
    );
  });
});
