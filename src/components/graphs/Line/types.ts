// Type definitions for graph data
// Utils
import {format} from 'date-fns';

export type graphDataPoint = {
  /*
   * graphDataPoint is a class that represents a single point of data for a graph.
   * It contains a date and a value.
   */
  date: number;
  value: number | null;
};

export class GraphPlotData {
  /*
   * GraphPlotData is a class that takes in an array of graphDataPoints and
   * calculates the average value and period label for the data.
   *
   * @param data an array of graphDataPoints
   * @param unit the unit of the data
   * @param averageValue the average value of the data
   * @param averagePeriodLabel the average period label of the data
   */
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

  constructor(data: graphDataPoint[], unit: string) {
    this.unit = unit;
    this.data = data;
    this.averageValue = this.getAverageValue();
    this.averagePeriodLabel = this.getAveragePeriodLabel();
  }
}
