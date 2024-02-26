import {getMoodTags} from '@services/db/moodTag/Functions';
import * as SqlClientFuncs from '@services/db/SqlClient';
import {ExecutionResult} from '@services/db/Types';

describe('getMoodTags', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getMoodTags works', async () => {
    // Arrange
    const query = {
      sqlStatement: 'SELECT * FROM mood_tag;',
      params: [],
    };
    const testTags = [
      {
        mood_tag_id: '1',
        label: 'Happy',
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
        category: 'positive',
      },
      {
        mood_tag_id: '2',
        label: 'Sad',
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
        category: 'negative',
      },
    ];
    const result: ExecutionResult[] = [
      {
        originalQuery: query,
        result: testTags,
        error: null,
      },
    ];
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce(result);

    // Act
    const moodTags = await getMoodTags();

    // Assert
    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([query]);
    expect(moodTags).toEqual(testTags);
  });

  test('getMoodTags throws error if no mood tags found', async () => {
    // Arrange
    const query = {
      sqlStatement: 'SELECT * FROM mood_tag;',
      params: [],
    };
    const result: ExecutionResult[] = [
      {
        originalQuery: query,
        result: [],
        error: null,
      },
    ];
    const executeSqlBatchSpy = jest
      .spyOn(SqlClientFuncs, 'executeSqlBatch')
      .mockResolvedValueOnce(result);

    // Act
    const test = async () => {
      await getMoodTags();
    };

    // Assert
    await expect(test).rejects.toThrow('No mood tags found.');
    expect(executeSqlBatchSpy).toHaveBeenCalledTimes(1);
    expect(executeSqlBatchSpy).toHaveBeenCalledWith([query]);
  });
});
