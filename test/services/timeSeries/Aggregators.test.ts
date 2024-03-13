import {mean, median, mode, range, sum} from '@services/timeSeries/Aggregators';

describe('Aggregator Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const data = [1, 1, 2, 3, 4];
  // Mean Tests
  test('Mean', () => {
    expect(mean(data)).toBe(2.2);
  });
  test('Mean with empty data', () => {
    expect(mean([])).toBe(null);
  });
  // Median Tests
  test('Median', () => {
    expect(median(data)).toBe(2);
  });
  test('Median with empty data', () => {
    expect(median([])).toBe(null);
  });
  test('Median with even length data', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
  // Mode Tests
  test('Mode', () => {
    expect(mode(data)).toBe(1);
  });
  test('Mode with empty data', () => {
    expect(mode([])).toBe(null);
  });
  test('Mode with no mode', () => {
    // Returns first mode if there are multiple
    expect(mode([1, 1, 2, 2, 3, 3])).toBe(1);
  });
  // Range Tests
  test('Range', () => {
    expect(range(data)).toBe(3);
  });
  test('Range with empty data', () => {
    expect(range([])).toBe(null);
  });
  // Sum Tests
  test('Sum', () => {
    expect(sum(data)).toBe(11);
  });
  test('Sum with empty data', () => {
    expect(sum([])).toBe(null);
  });
});
