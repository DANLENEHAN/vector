import {getMoodTagObject} from '@services/api/blueprints/moodTag/Functions';
import * as dbMoodTagFunctions from '@services/db/moodTag/Functions';
import {MoodTagCategory} from '@services/api/swagger/data-contracts';

describe('getMoodTagObject', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  it('getMoodTagObject works', async () => {
    // Arrange
    const moodTags = [
      {
        mood_tag_id: '1',
        label: 'Happy',
        icon: 'happy',
        category: MoodTagCategory.Emotions,
        user_id: '1',
        created_at: '2021-01-01T00:00:00.000Z',
        timezone: 'UTC',
      },
    ];
    const getMoodTagsSpy = jest
      .spyOn(dbMoodTagFunctions, 'getMoodTags')
      .mockResolvedValueOnce(moodTags);

    // Act
    const response = await getMoodTagObject();

    // Assert
    expect(getMoodTagsSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      [MoodTagCategory.Emotions]: [
        {
          label: 'Happy',
          icon: 'happy',
          color: undefined,
          tagId: '1',
        },
      ],
    });
  });

  it('getMoodTagObject returns undefined if error', async () => {
    // Arrange
    const getMoodTagsSpy = jest
      .spyOn(dbMoodTagFunctions, 'getMoodTags')
      .mockRejectedValueOnce('Error');

    // Act
    const response = await getMoodTagObject();

    // Assert
    expect(getMoodTagsSpy).toHaveBeenCalledTimes(1);
    expect(response).toBeUndefined();
  });
});
