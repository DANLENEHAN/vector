// Functions
import {getDeviceInfo} from '@services/system/Functions';
import logger from '@utils/Logger';

// Types
import {SessionEventDeviceInfo} from '@services/system/Types';

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn().mockResolvedValue('mockedDeviceId'),
  getUserAgent: jest.fn().mockResolvedValue('mockedUserAgent'),
  getBrand: jest
    .fn()
    .mockReturnValueOnce('mockedBrand')
    .mockImplementationOnce(() => {
      throw 'Error!';
    }),
  getSystemVersion: jest.fn().mockReturnValue('mockedSystemVersion'),
  getVersion: jest.fn().mockReturnValue('mockedVersion'),
}));

describe('System Functions Tests', () => {
  const deviceInfo: SessionEventDeviceInfo = {
    brand: 'mockedBrand',
    deviceId: 'mockedDeviceId',
    systemVersion: 'mockedSystemVersion',
    userAgent: 'mockedUserAgent',
    version: 'mockedVersion',
  };

  test('getDeviceInfo apis return no errors', async () => {
    // Arrange
    // Assert
    const response = await getDeviceInfo();
    // Act
    expect(response).toEqual(deviceInfo);
  });

  test('getDeviceInfo apis returns errors', async () => {
    // Arrange
    // Assert
    const response = await getDeviceInfo();
    // Act
    expect(response).toEqual(null);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(`Error in getDeviceInfo: Error!`);
  });
});
