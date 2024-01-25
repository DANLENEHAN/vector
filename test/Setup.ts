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
