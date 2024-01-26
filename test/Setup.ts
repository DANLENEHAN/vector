/**
 * Global setup for tests
 */
jest.mock('react-native-fs', () => {});
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
  };

  return {
    __esModule: true, // this property makes it work
    default: mockLogger,
  };
});
