import {valueAggregator} from '@services/timeSeries/Types';

/**
 * Aggregates a list of numbers by summing them.
 * @param data List of numbers to sum
 * @returns The sum of the list of numbers or null if the list is empty
 */
export const sum: valueAggregator = data => {
  if (!data) {
    return null;
  }
  const filteredData = data.filter((value): value is number => value !== null);
  if (filteredData.length === 0) {
    return null;
  }
  return filteredData.reduce((acc, value) => acc + value, 0);
};

/**
 * Aggregates a list of numbers by averaging them.
 * @param data List of numbers to average
 * @returns The average of the list of numbers or null if the list is empty
 */
export const mean: valueAggregator = data => {
  const filteredData = data.filter((value): value is number => value !== null);
  if (filteredData.length === 0) {
    return null;
  }
  const sum = filteredData.reduce((acc, value) => acc + value, 0);
  return sum / filteredData.length;
};

/**
 * Aggregates a list of numbers by finding the median.
 * @param data List of numbers to find the median of
 * @returns The median of the list of numbers or null if the list is empty
 */
export const median: valueAggregator = data => {
  const filteredData = data
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);
  if (filteredData.length === 0) {
    return null;
  }
  const mid = Math.floor(filteredData.length / 2);
  return filteredData.length % 2 !== 0
    ? filteredData[mid]
    : (filteredData[mid - 1] + filteredData[mid]) / 2;
};

/**
 * Aggregates a list of numbers by finding the mode.
 * @param data List of numbers to find the mode of
 * @returns The mode of the list of numbers or null if the list is empty
 */
export const mode: valueAggregator = data => {
  const filteredData = data.filter((value): value is number => value !== null);
  if (filteredData.length === 0) {
    return null;
  }
  const frequency: {[key: number]: number} = {};
  let maxFreq = 0;
  let mode = null;
  filteredData.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  });
  return mode;
};

/**
 * Aggregates a list of numbers by finding the range.
 * @param data List of numbers to find the range of
 * @returns The range of the list of numbers or null if the list is empty
 */
export const range: valueAggregator = data => {
  const filteredData = data.filter((value): value is number => value !== null);
  if (filteredData.length === 0) {
    return null;
  }
  const min = Math.min(...filteredData);
  const max = Math.max(...filteredData);
  return max - min;
};
