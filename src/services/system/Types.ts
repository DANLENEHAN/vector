/**
 * Represents the device information included in a session event.
 *
 * @interface SessionEventDeviceInfo
 * @property {string} brand - The brand of the device.
 * @property {string} deviceId - The unique identifier of the device.
 * @property {string} systemVersion - The version of the operating system running on the device.
 * @property {string} userAgent - The user agent string representing the device and its capabilities.
 * @property {string} version - The version of the device.
 */
export interface SessionEventDeviceInfo {
  brand: string;
  deviceId: string;
  systemVersion: string;
  userAgent: string;
  version: string;
}
