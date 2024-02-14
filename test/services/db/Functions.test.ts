// Functions
import * as DbFunctions from '@services/db/Functions';

// Test Objects
import {MockAlembicRevisionObject} from './sync/Objects';

// Mock the 'react-native-sqlite-storage' module
jest.mock('react-native-sqlite-storage', () => {
  // Define the executeSql mock function here, directly within the jest.mock call
  const executeSqlMock = jest
    .fn()
    .mockImplementation((sql, params, success, error) => {
      // Simulate a successful SQL execution by invoking the success callback
      return Promise.resolve()
        .then(() => {
          if (success) {
            success();
          }
        })
        .catch(err => {
          if (error) {
            error(err);
          }
        });
    });

  return {
    openDatabase: jest.fn().mockImplementation(() => ({
      transaction: jest
        .fn()
        .mockImplementation((callback, errorCallback, successCallback) => {
          callback({
            executeSql: executeSqlMock,
          });
          // Simulate the end of the transaction
          Promise.resolve()
            .then(() => {
              if (successCallback) {
                successCallback();
              }
            })
            .catch(err => {
              if (errorCallback) {
                errorCallback(err);
              }
            });
        }),
    })),
  };
});

// Now, executeSqlMock is defined within the scope allowed by jest.mock()

describe('DB Functions Tests', () => {
  beforeEach(() => {
    // Clears 'toHaveBeenCalledTimes' cache
    jest.clearAllMocks();
  });

  test('getValuesAfterSpecifiedKey null key provided', () => {
    // Arrange
    // Act
    const response = DbFunctions.getValuesAfterSpecifiedKey(
      MockAlembicRevisionObject,
      null,
    );
    /// Assert
    expect(response).toEqual(MockAlembicRevisionObject);
  });

  test('getValuesAfterSpecifiedKey first key provided', () => {
    // Arrange
    const {revisionIdOne, ...rest} = MockAlembicRevisionObject;
    revisionIdOne;
    // Act
    const response = DbFunctions.getValuesAfterSpecifiedKey(
      MockAlembicRevisionObject,
      'revisionIdOne',
    );
    /// Assert
    expect(response).toEqual(rest);
  });

  test('getValuesAfterSpecifiedKey no revisions to process', () => {
    // Arrange
    // Act
    const response = DbFunctions.getValuesAfterSpecifiedKey(
      MockAlembicRevisionObject,
      'revisionIdThree',
    );
    /// Assert
    expect(response).toEqual({});
  });

  //   test('runMigrations revisions to process', async () => {
  // 	const mockFun = jest.spyOn(DbFunctions, 'getValuesAfterSpecifiedKey').mockReturnValue({});

  //     const res = await DbFunctions.runMigrations(MockAlembicRevisionObject, null);
  //     expect(mockFun).toHaveBeenCalledTimes(1);
  //   });
});
