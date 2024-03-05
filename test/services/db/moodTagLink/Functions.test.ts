import {insertMoodTagLinks} from '@services/db/moodTagLink/Functions';
import * as dbFunctions from '@services/db/Operations';

describe('insertMoodTagLinks', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  it('insertMoodTagLinks works', async () => {
    // Arrange
    const moodTagLinks = [
      {
        mood_tag_link_id: '1',
        mood_id: '1',
        mood_tag_id: '1',
        created_at: '2021-01-01T00:00:00.000Z',
        timezone: 'UTC',
      },
      {
        mood_tag_link_id: '2',
        mood_id: '1',
        mood_tag_id: '2',
        created_at: '2021-01-01T00:00:00.000Z',
        timezone: 'UTC',
      },
    ];
    const insertRowsSpy = jest
      .spyOn(dbFunctions, 'insertRows')
      .mockResolvedValueOnce();

    // Act
    await insertMoodTagLinks(moodTagLinks);

    // Assert
    expect(insertRowsSpy).toHaveBeenCalledTimes(1);
    expect(insertRowsSpy).toHaveBeenCalledWith('mood_tag_link', moodTagLinks);
  });
});
