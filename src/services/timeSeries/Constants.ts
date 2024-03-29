import {
  intervalLengthsMappings,
  timePeriodLookbacksMappings,
  labelGenerators,
  intervalDates,
  graphData,
  graphPeriodData,
  statisticAggregator,
  statisticType,
} from '@services/timeSeries/Types';
import {mean, median, mode, range, sum} from '@services/timeSeries/Aggregators';
import moment, {Moment} from 'moment-timezone';
import {DateFormat, TimeFormat} from '@shared/Enums';

// The extra value added to the max value of the graph to
// prevent the max value from being the top of the graph
export const maxValuePadding = 10;

export const defaultNullString = '-';

/**
 * Object to map interval lengths to their respective values and cadences.
 * Interval Length = intervalLength.value * intervalLength.cadence
 * @typedef {Object} intervalLengthsMappings
 * @property {number} N.value - The value of the interval length.
 * @property {string} N.cadence - The cadence of the interval length.
 */
export const intervalLengths: intervalLengthsMappings = {
  day: {
    value: 1,
    cadence: 'hour',
  },
  week: {
    value: 1,
    cadence: 'days',
  },
  month: {
    value: 1,
    cadence: 'days',
  },

  halfYear: {
    value: 1,
    cadence: 'weeks',
  },
  year: {
    value: 1,
    cadence: 'months',
  },
};

/**
 * Object to map time periods to their respective start and end date functions.
 * @typedef {Object} timePeriodLookbacksMappings
 * @property {function} N.getStart - The function to get the start date of the time period.
 * @property {function} N.getEnd - The function to get the end date of the time period.
 */
export const timePeriodLookbacks: timePeriodLookbacksMappings = {
  day: {
    getStart: (date: Moment) => date.startOf('day'),
    getEnd: (date: Moment) => date.endOf('day'),
  },
  week: {
    getStart: (date: Moment) => date.startOf('day').subtract(6, 'day'),
    getEnd: (date: Moment) => date.endOf('day'),
  },
  month: {
    getStart: (date: Moment) => date.startOf('day').subtract(29, 'day'),
    getEnd: (date: Moment) => date.endOf('day'),
  },
  halfYear: {
    getStart: (date: Moment) =>
      date.endOf('month').subtract(6, 'months').startOf('month'),
    getEnd: (date: Moment) => date.endOf('day'),
  },
  year: {
    getStart: (date: Moment) =>
      date.endOf('month').subtract(11, 'months').startOf('month'),
    getEnd: (date: Moment) => date.endOf('month'),
  },
};

/**
 * Object to map time periods to their respective label generation functions.
 * @typedef {Object} labelGenerators
 * @property {function} N - The function to generate the label for the time period.
 */
export const axisLabelGenerators: labelGenerators = {
  day: (args: intervalDates) => moment(args.startDate).format(TimeFormat.HHMM),
  week: (args: intervalDates) => moment(args.startDate).format(DateFormat.DOW),
  month: (args: intervalDates) =>
    moment(args.startDate).format(DateFormat.DDMM),
  halfYear: (args: intervalDates) =>
    moment(args.startDate).format(DateFormat.MMM),
  year: (args: intervalDates) =>
    moment(args.startDate).format(DateFormat.MMM).substring(0, 1),
};

/**
 * Object to represent the data for the graph when no data is available.
 * @typedef {Object} graphData
 * @property {Array} data - The data for the graph.
 * @property {string} averageValue - The average value for the graph.
 * @property {string} unit - The unit for the graph.
 * @property {string} averagePeriodLabel - The label for the average period.
 */
const emptyGraphData: graphData = {
  data: [],
  value: 'No Data',
  unit: '',
  periodLabel: '',
};

const loadingGraphData: graphData = {
  data: [],
  value: 'Loading...',
  unit: '',
  periodLabel: '',
};
/**
 * Object to represent the data for the graph for each time period when no data is available.
 * @typedef {Object} graphPeriodData
 * @property {graphData} day - The data for the day time period.
 * @property {graphData} week - The data for the week time period.
 * @property {graphData} month - The data for the month time period.
 * @property {graphData} halfYear - The data for the half year time period.
 */
export const emptyGraphPeriodData: graphPeriodData = {
  day: emptyGraphData,
  week: emptyGraphData,
  month: emptyGraphData,
  halfYear: emptyGraphData,
  year: emptyGraphData,
};

export const loadingGraphPeriodData: graphPeriodData = {
  day: loadingGraphData,
  week: loadingGraphData,
  month: loadingGraphData,
  halfYear: loadingGraphData,
  year: loadingGraphData,
};

export const Aggregators: statisticAggregator = {
  [statisticType.mean]: mean,
  [statisticType.median]: median,
  [statisticType.mode]: mode,
  [statisticType.range]: range,
  [statisticType.sum]: sum,
};

export const StatisticLabels: Record<statisticType, string> = {
  [statisticType.mean]: 'Average:',
  [statisticType.median]: 'Median:',
  [statisticType.mode]: 'Mode:',
  [statisticType.range]: 'Range"',
  [statisticType.sum]: 'Total:',
};
