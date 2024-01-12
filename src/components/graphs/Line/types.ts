// Type definitions for graph data
// Utils
import {format} from 'date-fns';

/**
 * @description A class that represents a single point of data for a graph.
 * It contains a date and a value.
 * @param {number} date The date of the data point.
 * @param {number | null} value The value of the data point.
 */
export type graphDataPoint = {
  date: number;
  value: number | null;
};

/**
 * @description A class that represents a single point of data for a graph.
 * It contains a date and a value.
 *
 * @class GraphPlotData
 *
 * @property {graphDataPoint[]} data: an array of graphDataPoints
 * @property {string} unit: the unit of the data
 * @property {number} averageValue: the average value of the data
 * @property {string} averagePeriodLabel; the average period label of the data
 */
export class GraphPlotData {
  data: graphDataPoint[];
  unit: string;
  averageValue: number;
  averagePeriodLabel: string;

  /**
   * getAverageValue calculates the average value of the data
   * @param data an array of graphDataPoints
   * @returns the average value of the data
   *
   * @example
   * // returns 1.5
   * getAverageValue([
   * { date: new Date(2020, 0, 1), value: 1 },
   * { date: new Date(2020, 12, 31), value: 2 }
   * ]);
   */
  getAverageValue() {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < this.data.length; i++) {
      let current = this.data[i].value;
      // If the value is null, do not include it in the average
      if (current !== null) {
        sum += current;
      }
      count++;
    }
    return sum / count;
  }

  /**
   * getAveragePeriodLabel calculates the average period label of the data
   * Assumes that the data is sorted by date
   *
   * @param data an array of graphDataPoints
   * @returns the average period label of the data
   *
   * @example
   * // returns '1 Jan - 31 Dec 2020'
   * getAveragePeriodLabel([
   *  { date: new Date(2020, 0, 1), value: 1 },
   * { date: new Date(2020, 12, 31), value: 2 }
   * ]);
   *
   * */
  getAveragePeriodLabel() {
    // If there is no data, return empty string
    if (this.data.length === 0) {
      return '';
    }
    // If there is only one data point, return the date
    if (this.data.length === 1) {
      return `${format(this.data[0].date, 'd MMM yyyy')}`;
    }
    // If there are multiple data points, return the first and last date
    const firstDate = this.data[0].date;
    const lastDate = this.data[this.data.length - 1].date;
    return `${format(firstDate, 'd MMM')} - ${format(lastDate, 'd MMM yyyy')}`;
  }

  /**
   * @description The constructor for the GraphPlotData class.
   * @param {graphDataPoint[]} data An array of graphDataPoints.
   * @param {string} unit The unit of the data.
   *
   * @example
   * // Example usage:
   * const data = [
   *  { date: new Date(2020, 0, 1), value: 1 },
   *  { date: new Date(2020, 12, 31), value: 2 }
   * ];
   * const unit = 'kg';
   * const graphPlotData = new GraphPlotData(data, unit);
   */
  constructor(data: graphDataPoint[], unit: string) {
    this.unit = unit;
    this.data = data;
    this.averageValue = this.getAverageValue();
    this.averagePeriodLabel = this.getAveragePeriodLabel();
  }
}
