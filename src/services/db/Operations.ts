// Types
import {GetRowsParams, RowData} from '@services/db/Types';
import {SortOrders, timestampFields} from '@shared/Constants';
import {SqlQuery, ExecutionResult} from '@services/db/Types';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {getTimestampForRow} from '@services/db/QueryExecutors';
import 'react-native-get-random-values';
// Logger
import logger from '@utils/Logger';
import {buildWhereClause, transformDbRows} from '@services/db/Functions';

export const insertRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

  const schema = Object.keys(data[0]);
  const columns = schema.join(', ');
  const results = await executeSqlBatch(
    data.map(row => ({
      sqlStatement: `INSERT INTO ${tableName} (${columns}) VALUES (${schema
        .map(() => '?')
        .join(', ')});`,
      params: Object.values(row),
    })),
  );

  results.forEach((result, index) => {
    if (result.error) {
      logger.error(
        `Error during insertion of row ${index + 1}: ${result.error}`,
      );
    } else {
      logger.info(`Successfully inserted row ${index + 1} in '${tableName}'.`);
    }
  });
};

export const updateRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

  let replaceCount = 0;
  const schema = Object.keys(data[0]);

  const columns = schema.join(', ');
  const placeholders = `${Object.keys(schema)
    .map(() => '?')
    .join(', ')}`;

  const rowIdColumn = `${tableName}_id`;
  const currentTimestamps: any = {};
  for (const obj of data) {
    currentTimestamps[obj[rowIdColumn]] = await getTimestampForRow(
      tableName,
      timestampFields.updatedAt,
      obj[rowIdColumn],
    );
  }

  const filteredData = data.filter(newRowObject => {
    const rowId = newRowObject[rowIdColumn];
    const currentRowTimestamp = currentTimestamps[rowId];
    return (
      currentRowTimestamp === null ||
      newRowObject[timestampFields.updatedAt] > currentRowTimestamp
    );
  });

  if (filteredData.length > 0) {
    const queries: SqlQuery[] = filteredData.map(newRowObject => ({
      sqlStatement: `REPLACE INTO ${tableName} (${columns}) VALUES (${placeholders});`,
      params: Object.values(newRowObject),
    }));

    const results: ExecutionResult[] = await executeSqlBatch(queries);

    results.forEach(result => {
      if (result.error) {
        logger.error(`Error updating rows: ${result.error}`);
      } else {
        replaceCount++;
      }
    });

    logger.info(
      `Successfully replaced ${replaceCount} row${
        replaceCount !== 1 ? 's' : ''
      } in '${tableName}' out of the ${
        filteredData.length
      } pulled in the sync.`,
    );
  } else {
    logger.info(
      `None of the Update rows for Ttble '${tableName}' are more recent their existing data...skipping`,
    );
  }
};

export const getRows = async <T>(
  params: GetRowsParams,
): Promise<T[] | null> => {
  // Build Query Components
  const columnsToSelect = (params.selectColumns || ['*']).join(', ');
  const selectString = `SELECT ${columnsToSelect} FROM ${params.tableName}`;
  const whereString = params.whereConditions
    ? `WHERE ${buildWhereClause(params.whereConditions)} AND deleted != 1`
    : 'WHERE deleted != 1';
  const orderByString = params.orderConditions
    ? `ORDER BY ${Object.entries(params.orderConditions)
        .map((item: [string, SortOrders]) => {
          return `${item[0]} ${item[1]}`;
        })
        .join(', ')}`
    : '';
  const limitString = params.limit ? `LIMIT ${params.limit}` : '';

  // Build full query from components
  const sqlStatement = `${[
    selectString,
    whereString,
    orderByString,
    limitString,
  ]
    .filter(string => string)
    .join(' ')};`;

  const sqlResult: ExecutionResult[] = await executeSqlBatch([{sqlStatement}]);
  if (sqlResult[0].error) {
    logger.warn(`Unable to get data with error: ${sqlResult[0].error}`);
    return null;
  }
  const result = sqlResult[0].result;

  if (result.length > 0) {
    // Fix typing later
    return transformDbRows(result);
  } else {
    return result as T[];
  }
};
