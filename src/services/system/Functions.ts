// Functions
import DeviceInfo from 'react-native-device-info';
// Types
import {SessionEventDeviceInfo} from '@services/system/Types';
// Logger
import logger from '@utils/Logger';

/**
 * Asynchronously retrieves device information using the DeviceInfo library.
 *
 * @returns {Promise<SessionEventDeviceInfo>} A promise that resolves to an object containing various device information.
 * @throws {Error} Throws an error if there is any issue retrieving the device information.
 */
export const getDeviceInfo =
  async (): Promise<SessionEventDeviceInfo | null> => {
    try {
      // Retrieve device information using the DeviceInfo library
      const brand = DeviceInfo.getBrand();
      const systemVersion = DeviceInfo.getSystemVersion();
      const version = DeviceInfo.getVersion();

      // Retrieve user agent asynchronously
      const deviceId = await DeviceInfo.getUniqueId();
      const userAgent = await DeviceInfo.getUserAgent();

      // Return an object containing the device information
      return {
        brand,
        deviceId,
        systemVersion,
        userAgent,
        version,
      };
    } catch (error) {
      logger.warn(`Error in getDeviceInfo: ${error}`);
      return null;
    }
  };
