import {createNewMoodTagLink} from '@services/api/blueprints/moodTagLink/Functions';
import * as dbMoodTagLinkFunctions from '@services/db/moodTagLink/Functions';
import logger from '@utils/Logger';

jest.mock('@services/date/Functions', () => ({
  ...jest.requireActual('@services/date/Functions'),
  getCurrentTimestampTimezone: jest.fn().mockReturnValue({
    timestamp: '2025-01-01T00:00:00.000',
    timezone: 'UTC',
  }),
}));
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fakeUuid'),
}));

describe('createNewMoodTagLink', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  it('createNewMoodTagLink works', async () => {
    // Arrange
    const moodId = '1';
    const moodTagIds = ['1', '2'];
    const callback = jest.fn();

    const insertMoodTagLinksSpy = jest
      .spyOn(dbMoodTagLinkFunctions, 'insertMoodTagLinks')
      .mockResolvedValueOnce(undefined);

    // Act
    await createNewMoodTagLink({
      mood_id: moodId,
      mood_tag_ids: moodTagIds,
      callback: callback,
    });

    // Assert
    expect(insertMoodTagLinksSpy).toHaveBeenCalledTimes(1);
    expect(insertMoodTagLinksSpy).toHaveBeenCalledWith([
      {
        mood_id: moodId,
        mood_tag_id: '1',
        mood_tag_link_id: 'fakeUuid',
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
      {
        mood_id: moodId,
        mood_tag_id: '2',
        mood_tag_link_id: 'fakeUuid',
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
    ]);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('createNewMoodTagLink logs error if error', async () => {
    // Arrange
    const moodId = '1';
    const moodTagIds = ['1', '2'];
    const callback = jest.fn();

    const insertMoodTagLinksSpy = jest
      .spyOn(dbMoodTagLinkFunctions, 'insertMoodTagLinks')
      .mockRejectedValueOnce('Error');

    // Act
    await createNewMoodTagLink({
      mood_id: moodId,
      mood_tag_ids: moodTagIds,
      callback: callback,
    });

    // Assert
    expect(insertMoodTagLinksSpy).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledWith('Error: Error');
  });
});
