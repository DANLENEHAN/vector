// Functions
import {Moment} from 'moment';
import {
  transformData,
  convertData,
  convertDataDate,
  getGraphData,
} from './Functions';
// Constants
import {emptyGraphPeriodData} from './Constants';
// Logger
import logger from '@utils/Logger';
// Types
import {UnitType} from '@utils/Conversion';
import {SchemaMapping, GetSchemaType, graphPeriodData} from './Types';

/**
 * Function to generate graph data
 * @param table {T} - The table name
 * @param data {Array<GetSchemaType<T>>} - The data from the database
 * @param targetUnit {UnitType} - The target unit
 * @param targetDate {Moment} - The target date
 * @returns {graphPeriodData} - The graph data
 * */
export function generateGraphData<T extends keyof SchemaMapping>({
  table,
  data,
  targetUnit,
  targetDate,
}: {
  table: T;
  data: Array<GetSchemaType<T>>;
  targetUnit?: UnitType;
  targetDate?: Moment;
}): graphPeriodData {
  if (data.length === 0) {
    logger.warn('No data provided');
    return emptyGraphPeriodData;
  }
  const transformedData = transformData({table, data});
  const convertedData = targetUnit
    ? convertData(transformedData, targetUnit)
    : transformedData;
  const graphData = convertDataDate(convertedData);
  return getGraphData(graphData, targetDate, targetUnit);
}
