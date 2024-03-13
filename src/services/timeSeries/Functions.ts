// Types
import {
  SchemaMapping,
  timePeriodLabels,
  graphPeriodData,
  intervalDates,
  GetSchemaType,
  FieldMapping,
  labelGenerators,
  dataPoint,
  graphDataPoint,
  timePeriods,
  datedDataPoint,
  statisticType,
} from '@services/timeSeries/Types';
// Constants
import {timestampFields} from '@shared/Constants';
import {
  timePeriodLookbacks,
  intervalLengths,
  axisLabelGenerators,
  Aggregators,
} from '@services/timeSeries/Constants';
import {TimestampFormat, TimeFormat, DateFormat} from '@shared/Enums';
// Functions
import {convertValue, UnitType} from '@utils/Conversion';
import moment, {Moment} from 'moment-timezone';

/**
 * Function creates a string representation of the interval dates
 *
 * @param interval {intervalDates} - The interval dates
 * @returns {string} - The string representation of the interval dates
 */
export function getIntervalDatesLabel(interval: intervalDates): string {
  const parsedStartDate = moment(interval.startDate).format(
    TimestampFormat.DD_MMM_YYYY_HHMMss,
  );
  let parsedEndDate = moment(interval.endDate).format(
    TimestampFormat.DD_MMM_YYYY_HHMMss,
  );
  let startDay = parsedStartDate.split(' ')[0];
  if (startDay.substring(0, 1) === '0') {
    // Remove leading zero
    startDay = startDay.substring(1, 2);
  }
  const startMonth = parsedStartDate.split(' ')[1];
  const startYear = parsedStartDate.split(' ')[2];

  const endTime = parsedEndDate.split(' ')[3];
  if (endTime === '00:00') {
    // If the end time is midnight, we can assume the end date is the day before as
    // the interval is not inclusive of the end date
    parsedEndDate = moment(interval.endDate - 1).format(
      TimestampFormat.DD_MMM_YYYY_HHMMss,
    );
  }
  let endDay = parsedEndDate.split(' ')[0];
  if (endDay.substring(0, 1) === '0') {
    // Remove leading zero
    endDay = endDay.substring(1, 2);
  }
  const endMonth = parsedEndDate.split(' ')[1];
  const endYear = parsedEndDate.split(' ')[2];

  if (startYear !== endYear) {
    // Different years
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  }
  if (startMonth !== endMonth) {
    // Different months
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
  }
  if (startDay !== endDay) {
    // Different days
    return `${startDay} - ${endDay} ${endMonth} ${endYear}`;
  }
  // Same day
  return `${startDay} ${endMonth} ${endYear}`;
}

/**
 * Function to generate the axis label for the interval
 *
 * @param interval {intervalDates} - The interval dates
 * @returns {string} - The axis label for the interval
 */
export const valueLabelGenerators: labelGenerators = {
  day: (args: intervalDates) => moment(args.startDate).format(TimeFormat.HHMM),
  week: (args: intervalDates) => moment(args.startDate).format(DateFormat.DOW),
  month: (args: intervalDates) =>
    moment(args.startDate).format(DateFormat.DD_MMM),
  halfYear: (args: intervalDates) => getIntervalDatesLabel(args),
  year: (args: intervalDates) =>
    moment(args.startDate).format(DateFormat.MM_YYYY),
};

/**
 * Function to transform data from the database to the format
 * required for the graph.
 * @param table {T} - The table name
 * @param data {Array<GetSchemaType<T>>} - The data from the database
 * @returns {Array<dataPoint>} - The transformed data
 * @throws {Error} - Throws an error if the unit column is not found
 */
export function transformData<T extends keyof SchemaMapping>({
  table,
  data,
}: {
  table: T;
  data: Array<GetSchemaType<T>>;
}): Array<dataPoint> {
  const fieldMappings = FieldMapping[table];
  const valueColumn = fieldMappings.valueColumn as keyof GetSchemaType<T>;
  const dateColumn = timestampFields.createdAt as keyof GetSchemaType<T>;
  // If unitValue is in the field mappings,
  // then unitValue will be used as the unit for all the data points
  if ('unitValue' in fieldMappings) {
    const unitValue = fieldMappings.unitValue;
    return data.map(
      entry =>
        ({
          value: entry[valueColumn],
          date: entry[dateColumn],
          unit: unitValue,
        } as dataPoint),
    );
  }

  // If unitValue is not in the field mappings,
  // then unitColumn must be in the field mappings
  if (!('unitColumn' in fieldMappings)) {
    throw new Error('Unit column not found');
  }
  const unitColumn = fieldMappings.unitColumn as keyof GetSchemaType<T>;

  return data.map(
    point =>
      ({
        value: point[valueColumn],
        date: point[dateColumn],
        unit: point[unitColumn],
      } as dataPoint),
  );
}

/**
 * Function to convert a data point to a different unit
 * @param dataPoint {dataPoint} - The data point
 * @param targetUnit {UnitType} - The target unit
 * @param precision {number} - The precision to round the value to
 * @returns {dataPoint} - The data point with the value converted to the target unit
 */
export function convertDataPoint(
  point: dataPoint,
  targetUnit: UnitType,
  precision: number = 2,
): dataPoint {
  if (point.unit === targetUnit) {
    return point;
  }
  return {
    value: Number(
      convertValue({
        value: point.value,
        fromUnit: point.unit as UnitType,
        toUnit: targetUnit,
      }).toFixed(precision),
    ),
    date: point.date,
    unit: targetUnit,
  };
}

/**
 * Function to convert an array of data points to a different unit
 * @param data {Array<dataPoint>} - The data
 * @param targetUnit {UnitType} - The target unit
 * @returns {Array<dataPoint>} - The data with the values converted to the target unit
 */
export function convertData(
  data: Array<dataPoint>,
  targetUnit: UnitType,
): Array<dataPoint> {
  return data.map(point => convertDataPoint(point, targetUnit));
}

/**
 * Function to convert a data point to a graph data point
 * @param data {dataPoint} - The data point
 * @returns {graphDataPoint} - The graph data point
 */
export function convertDataPointDate(data: dataPoint): datedDataPoint {
  const date = moment(data.date, TimestampFormat.YYYYMMDDHHMMssSSS).valueOf();
  return {
    value: data.value,
    date: date,
    unit: data.unit,
    // Overwritten in the next step
    index: 0,
  };
}

/**
 * Function to convert an array of data points to graph data points
 * @param data {Array<dataPoint>} - The data
 * @returns {Array<graphDataPoint>} - The data with the values converted to the target unit
 */
export function convertDataDate(data: Array<dataPoint>): Array<datedDataPoint> {
  return data.map((point, index) => {
    const graphPoint = convertDataPointDate(point);
    graphPoint.index = index;
    return graphPoint;
  });
}

/**
 * Function to filter data by dates
 * @param data {Array<graphDataPoint>} - The data
 * @param startDate {number} - The start date
 * @param endDate {number} - The end date
 * @returns {Array<graphDataPoint>} - The filtered data
 */
export function filterDataByDates(
  data: Array<datedDataPoint>,
  startDate: number,
  endDate: number,
): Array<datedDataPoint> {
  return data.filter(dataPoint => {
    // At this point, we are dealing with points not intervals
    // therefore data.startDate === data.endDate
    // Using >= and < to filter the data, as we want to include the start date
    // but exclude the end date so that the intervals don't overlap
    return dataPoint.date >= startDate && dataPoint.date < endDate;
  });
}

/**
 * Function to get data for a period
 * @param data {Array<graphDataPoint>} - The data
 *  @param period {timePeriods} - The period
 * @param targetDate {Moment} - The target date
 * @returns {Array<graphDataPoint>} - The data for the period
 * */
export function getDataForPeriod(
  data: Array<datedDataPoint>,
  period: timePeriods,
  targetDate?: Moment,
): Array<datedDataPoint> {
  // If no target date is provided, use the current date
  const date = targetDate ? targetDate : moment();
  const lookback = timePeriodLookbacks[period];
  const startDate = lookback.getStart(date).valueOf();
  const endDate = lookback.getEnd(date).valueOf();
  return filterDataByDates(data, startDate, endDate);
}

/**
 * Function to get the intervals for a period
 * @param period {timePeriods} - The period
 * @param targetDate {Moment} - The target date
 * @returns {Array<intervalDates>} - The intervals for the period
 */
export function getIntervals(
  period: timePeriods,
  targetDate?: Moment,
): Array<intervalDates> {
  // If no target date is provided, use the current date
  const date = targetDate ? targetDate : moment();
  const intervalLength = intervalLengths[period];
  const lookback = timePeriodLookbacks[period];
  const startDate = lookback.getStart(date.clone()).valueOf();
  const endDate = lookback.getEnd(date.clone()).valueOf();
  const output = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    let nextDate = moment(currentDate)
      .add(intervalLength.value, intervalLength.cadence)
      .valueOf();
    output.push({
      startDate: currentDate,
      endDate: nextDate,
    });
    currentDate = nextDate;
  }
  return output;
}

/**
 * Function to get data for a period
 * @param data {Array<graphDataPoint>} - The data
 * @param intervals {Array<intervalDates>} - The intervals
 * @param period {timePeriods} - The period
 * @param unit {string} - The unit
 * @returns {Array<graphDataPoint>} - The data for the period
 * */
export function getPeriodData(
  data: Array<datedDataPoint>,
  intervals: intervalDates[],
  period: timePeriods,
  unit: string,
  statisticType: statisticType,
): Array<graphDataPoint> {
  const output = [] as graphDataPoint[];
  let count = 0;
  intervals.forEach(interval => {
    const filteredData = filterDataByDates(
      data,
      interval.startDate,
      interval.endDate,
    );

    const value = Aggregators[statisticType](
      filteredData.map(dataPoint => dataPoint.value),
    );

    const result = {
      label: valueLabelGenerators[period](interval),
      value: value,
      startDate: interval.startDate,
      endDate: interval.endDate,
      axisLabel: axisLabelGenerators[period](interval),
      unit: unit,
      index: count,
      numberOfDataPoints: filteredData.length,
    };

    output.push(result);
    count++;
  });
  return output;
}

/**
 * Function to get the full graph data
 * @param data {Array<graphDataPoint>} - The data
 * @param targetDate {Moment} - The target date
 * @param targetUnit {UnitType} - The target unit
 * @returns {graphPeriodData} - The full graph data
 * */
export function getGraphData(
  data: Array<datedDataPoint>,
  statisticType: statisticType,
  targetDate?: Moment,
  targetUnit?: UnitType,
): graphPeriodData {
  let output = {} as graphPeriodData;
  const periods = Object.values(timePeriodLabels);
  // If no target unit is provided, use the unit of the first data point
  // If target unit is provided, use that
  // If no data points are provided, use an empty string
  const unit = targetUnit || data.length > 0 ? data[0].unit : '';
  periods.forEach(period => {
    const intervals = getIntervals(period, targetDate);
    const startDate = intervals[0].startDate;
    const endDate = intervals[intervals.length - 1].endDate;
    // Filter data by earliest to latest date
    const filteredData = filterDataByDates(data, startDate, endDate);
    // Get data for the period
    const periodData = getPeriodData(
      filteredData,
      intervals,
      period,
      unit,
      statisticType,
    );
    // Get average value for the period
    const periodValue = Aggregators[statisticType](
      filteredData.map(dataPoint => dataPoint.value),
    );

    const periodGraphData = {
      data: periodData,
      periodLabel: getIntervalDatesLabel({
        startDate: periodData[0].startDate,
        endDate: periodData[periodData.length - 1].endDate,
      }),
      value: Number(periodValue?.toFixed(2)) || null,
      unit: unit,
    };

    output[period] = periodGraphData;
  });
  return output;
}

/**
 * Function to get the earliest lookback date for the target date
 * @param targetDate The target date
 * @returns The earliest lookback date for the target date
 */
export const getEarliestLookbackDate = (
  targetDate: moment.Moment,
): moment.Moment => {
  const periodOptions = Object.values(timePeriodLabels) as timePeriods[];
  // Get all the start dates for the time periods
  const startDates = periodOptions.map(period => {
    const lookback = timePeriodLookbacks[period];
    return lookback.getStart(targetDate.clone());
  });
  // Get the minimum start date
  const minStartDate = startDates.reduce(
    (min, date) => (date < min ? date : min),
    startDates[0],
  );
  return minStartDate;
};
