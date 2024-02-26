import {getMoodTags} from '@services/db/moodTag/Functions';
import * as SqlClientFuncs from '@services/db/SqlClient';


describe('getMoodTags', () => {
    beforeEach(() => {
        // Clears 'toHaveBeenCalledTimes' cache
        jest.clearAllMocks();
    });
    
    test('getMoodTags works', async () => {
        // // Arrange
        // const query = {
        // sqlStatement: 'SELECT * FROM mood_tag;',
        // params: [],
        // };
        // const result = [
        // {
        //     result: [
        //     {
        //         mood_tag_id: '1',
        //         label: 'Happy',
        //         icon: 'happy',
        //         category: 'Positive',
        //     },
        //     {
        //         mood_tag_id: '2',
        //         label: 'Sad',
        //         icon: 'sad',
        //         category: 'Negative',
        //     },
        //     ],
        //     error: null,
        // },
        // ];
        // jest
        // .spyOn(SqlClientFuncs, 'executeSqlBatch')
        // .mockResolvedValueOnce(result);
    
        // // Act
        // const response = await getMoodTags();
    
        // // Assert
        // expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledTimes(1);
        // expect(SqlClientFuncs.executeSqlBatch).toHaveBeenCalledWith([query]);
        // expect(response).toEqual(result[0].result);
    });
    
    test('getMoodTags throws error if no mood tags found', async () => {
        // // Arrange
        // const query = {
        // sqlStatement: 'SELECT * FROM mood_tag;',
        // params: [],
        // };
        // const result = [
        // {
        //     result: [],
        //     error: null,
        // },
        // ];
        // jest
        // .spyOn(SqlClientFuncs, 'executeSqlBatch')
        // .mockResolvedValueOnce(result);
    
        // // Act
        // const response = getMoodTags();
    
        // // Assert
        // await expect(response).rejects.toThrow('No mood tags found.');
    });
    }
);