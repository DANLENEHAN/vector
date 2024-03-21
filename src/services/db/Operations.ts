// Types
import {GetRowsParams, RowData} from '@services/db/Types';
import {timestampFields} from '@shared/Constants';
import {SqlQuery, ExecutionResult} from '@services/db/Types';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {getTimestampForRow} from '@services/db/QueryExecutors';
import 'react-native-get-random-values';
// Logger
import logger from '@utils/Logger';
import {buildSqlQuery, transformDbRows} from '@services/db/Functions';
import {BooleanOperators} from '@services/api/swagger/data-contracts';

/**
 * Inserts multiple rows of data into the specified table.
 *
 * This generic function `insertRows` takes a table name and an array of data objects to be
 * inserted into the specified database table. It first checks if the data array is empty, throwing
 * an error if so to prevent futile operations. The function then dynamically constructs an SQL
 * insert statement for each row based on the keys of the first object in the data array, which
 * are assumed to represent the table's columns. It uses a batch execution strategy to insert
 * multiple rows efficiently, logging the outcome of each insertion.
 *
 * The generic type parameter `T` extends `RowData`, ensuring the function can handle any data
 * structure that conforms to a basic row data interface. This approach allows for a flexible and
 * type-safe way to interact with different tables within the database.
 *
 * @template T - The data type of the rows to be inserted, extending the basic `RowData` structure.
 * @param {string} tableName - The name of the table into which the rows will be inserted.
 * @param {T[]} data - An array of data objects, each representing a row to be inserted.
 * @async
 * @returns {Promise<void>} A promise that resolves when all rows have been attempted to be inserted,
 *                          logging each insertion's success or failure without returning any value.
 * @throws {Error} Throws an error if the data array is empty or if any SQL execution fails.
 */
export const insertRows = async <T extends RowData>(
  tableName: string,
  data: T[],
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

  const schema = Object.keys(data[0]);
  const columns = schema.join(', ');
  const results = await executeSqlBatch<T>(
    data.map(row => ({
      sqlStatement: `INSERT INTO ${tableName} (${columns}) VALUES (${schema
        .map(() => '?')
        .join(', ')});`,
      params: Object.values(row),
    })),
  );

  let insertedRows: number = 0;
  results.forEach((result, index) => {
    if (result.error) {
      logger.error(
        `Error during insertion of row ${index + 1}: ${result.error}`,
      );
    } else {
      insertedRows++;
    }
  });
  logger.info(
    `(tableName)=(${tableName}) - (${insertedRows}/${results.length}) rows successfully inserted`,
  );
};

/**
 * Updates or replaces rows in the specified table based on the provided data array.
 *
 * This function, `updateRows`, first verifies that the provided data array is not empty, throwing
 * an error if it is. It then constructs a dynamic SQL REPLACE statement for each row in the data
 * array, which allows for either updating existing rows or inserting new rows if they don't already
 * exist based on a unique identifier column (assumed to be `<tableName>_id`). It checks against
 * existing timestamps to ensure only rows with newer data are updated, aiming to maintain data
 * integrity and prevent overwriting with stale data.
 *
 * The function uses a batch execution approach for efficiency and logs the outcome of each
 * operation, including the total number of rows successfully updated or replaced.
 *
 * @template T - The data type of the rows to be updated, extending the basic `RowData` structure.
 * @param {string} tableName - The name of the table to update.
 * @param {T[]} data - An array of data objects, each representing a row to be updated or replaced.
 * @async
 * @returns {Promise<void>} A promise that resolves when all operations are complete, providing logs
 *                          of the process but not returning any value.
 * @throws {Error} Throws an error if the data array is empty or if any SQL operation encounters an
 *                 error.
 */
export const updateRows = async <T extends RowData>(
  tableName: string,
  data: T[],
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

  const rowIdColumn: string = `${tableName}_id`;
  const currentTimestamps: any = {};
  for (const obj of data) {
    currentTimestamps[obj[rowIdColumn]] = await getTimestampForRow<T>(
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

    const results: ExecutionResult<T>[] = await executeSqlBatch(queries);

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

/**
 * Retrieves rows of data from the database based on the provided parameters.
 *
 * @param params - An object containing parameters for retrieving rows from the database.
 * @param params.tableName - The name of the table to fetch data from.
 * @param params.selectColumns - An array of column names to select. Defaults to ["*"].
 * @param params.joins - An array of join clauses to apply in the query.
 * @param params.groupby - An array of columns to group by.
 * @param params.whereConditions - An array of conditions to apply in the WHERE clause.
 * @param params.orderConditions - An object containing column names as keys and sorting order (ASC or DESC) as values.
 * @param params.limit - The maximum number of rows to return.
 *
 * @returns A Promise that resolves with an array of retrieved rows, or null if an error occurs.
 */
export const getRows = async <T extends RowData>(
  params: GetRowsParams,
): Promise<T[] | null> => {
  // Time Start
  const startTime = new Date().getTime();
  // Build Query Components
  const sqlStatement = buildSqlQuery({
    table: params.tableName,
    selectColumns: params.selectColumns,
    joins: params.joins,
    groupby: params.groupby,
    whereConditions: {
      ...(params.whereConditions || {}),
      ...{
        [`${params.tableName}.deleted`]: {
          [BooleanOperators.Isfalse]: null,
        },
      },
    },
    orderConditions: params.orderConditions,
    limit: params.limit,
  });

  const sqlResult: ExecutionResult<T>[] = await executeSqlBatch<T>([
    {sqlStatement},
  ]);
  if (sqlResult[0].error) {
    logger.warn(`Unable to get data with error: ${sqlResult[0].error}`);
    return null;
  }
  let result = sqlResult[0].result;

  const endTime = new Date().getTime();
  result = transformDbRows<T>(result);
  logger.info(
    `(function)=(getRows); (tableName)=(${params.tableName}) ` +
      `- took ${endTime - startTime}ms`,
  );
  return result;
};
