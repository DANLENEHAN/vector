// Test Objects
import {sampleStat} from '../../objects';
import {SyncCreateSchemas} from '@services/db/sync/types';
import {dbTables} from '@shared/Constants';
import {SyncType, SyncOperation} from '@shared/enums';

// Functions
import {processUpdatesSyncTypePush} from '@services/db/sync/ProcessFunctions';
import {insertSyncUpdate} from '@services/db/sync/utils';

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
    createCreate: jest.fn().mockResolvedValue({}),
    updateUpdate: jest.fn().mockResolvedValue({
      status: 204,
    }),
  })),
}));

jest.mock('@services/db/sync/utils', () => ({
  ...jest.requireActual('@services/db/sync/utils'),
  insertSyncUpdate: jest.fn().mockResolvedValueOnce('OK'),
}));

describe('Sync ProcessFunctions Tests', () => {
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

    // Count includes previous runs
    expect(insertSyncUpdate).toHaveBeenCalledTimes(1);
  });
});
