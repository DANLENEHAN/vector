import {parseDate, formatDate} from '@services/date/Functions';
import {TimestampFormat, DateFormat} from '@shared/Enums';

export type graphInputData = {
  date: string;
  value: number | null;
};

export type graphDataPoint = {
  date: number; // Necessary for Victory, but documented for clarity
  dateStr: string;
  value: number | null;
};

/**
 * Class to prepare and analyze graph data.
 * Handles transformation, sorting of input data, and calculation of average metrics.
 */
export class GraphPlotData {
  unit: string;
  graphData: graphDataPoint[];
  averagePeriodLabel: string;
  averageValue: number;

  /**
   * Constructor to initialize graph data and calculate metrics.
   * @param data Array of input data including dates and values.
   * @param unit Measurement unit for the values.
   */
  constructor(data: graphInputData[], unit: string) {
    this.unit = unit;
    this.graphData = this.validateAndTransformInputData(data);
    this.averagePeriodLabel = this.calculateAveragePeriodLabel(this.graphData);
    this.averageValue = this.calculateAverageValue(this.graphData);
  }

  /**
   * Validates input data and transforms it into sorted graph data points.
   * @param inputData Array of raw input data.
   * @returns Array of transformed and sorted graph data points.
   */
  private validateAndTransformInputData(
    inputData: graphInputData[],
  ): graphDataPoint[] {
    const validatedData = inputData.filter(
      data => !isNaN(Date.parse(data.date)),
    );
    const sortedInputData = validatedData.sort(
      (a, b) =>
        parseDate(a.date, TimestampFormat.YYYYMMDDHHMMssSSS) -
        parseDate(b.date, TimestampFormat.YYYYMMDDHHMMssSSS),
    );
    return sortedInputData.map((dataPoint, index) => ({
      date: index,
      dateStr: formatDate(dataPoint.date, DateFormat.DDMM),
      value: dataPoint.value,
    }));
  }

  /**
   * Calculates the average value of the graph data points.
   * @param graphData Array of graph data points.
   * @returns The average value, excluding nulls.
   */
  private calculateAverageValue(graphData: graphDataPoint[]): number {
    let sum = 0;
    let count = 0;
    graphData.forEach(dataPoint => {
      if (dataPoint.value !== null) {
        sum += dataPoint.value;
        count++;
      }
    });
    return count > 0 ? sum / count : 0;
  }

  /**
   * Generates a label representing the period covered by the graph data.
   * @param graphData Array of graph data points.
   * @returns A string label for the period, or an empty string if no data.
   */
  private calculateAveragePeriodLabel(graphData: graphDataPoint[]): string {
    if (graphData.length === 0) {
      return '';
    }
    const firstDateStr = graphData[0].dateStr;
    const lastDateStr = graphData[graphData.length - 1].dateStr;
    return `${firstDateStr} - ${lastDateStr}`;
  }
}
