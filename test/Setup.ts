/**
 * Global setup for tests
 */
import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-push-notification', () => {});
jest.mock('react-native-fs', () => {});
jest.mock('@react-native-firebase/messaging', () => {});
jest.mock('react-native-device-info', () => {});
jest.mock('uuid', () => {});
jest.mock('react-native-localize', () => {});
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
  })),
}));
// Mock useSafeAreaInsets hook
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn().mockReturnValue({top: 0, bottom: 0}),
  SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
}));

jest.mock('@utils/Logger', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  return {
    __esModule: true, // this property makes it work
    default: mockLogger,
  };
});
