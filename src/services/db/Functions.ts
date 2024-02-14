// Types
import {RowData} from '@services/db/Types';
import {timestampFields} from '@shared/Constants';
import {SqlQuery, ExecutionResult} from '@services/db/Types';
// Functions
import {executeSqlBatch} from '@services/db/SqlClient';
import {getTimestampForRow} from '@services/db/QueryExecutors';
import 'react-native-get-random-values';
// Logger
import logger from '@utils/Logger';

export const insertRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    throw Error('No data to insert.');
  }

  const schema = Object.keys(data[0]);
  const columns = schema.join(', ');

  try {
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
        logger.info(
          `Successfully inserted row ${index + 1} in '${tableName}'.`,
        );
      }
    });
  } catch (error) {
    logger.error('Error during insertion:', error);
    throw error;
  }
};

export const updateRows = async (
  tableName: string,
  data: RowData[],
): Promise<void> => {
  if (data.length === 0) {
    logger.warn('No data to update.');
    return;
  }

  let replaceCount = 0;
  const schema = Object.keys(data[0]);

  const columns = schema.join(', ');
  const placeholders = `(${Object.keys(schema)
    .map(() => '?')
    .join(', ')})`;

  const filteredData = data.filter(async newRowObject => {
    const rowIdColumn = `${tableName}_id`;
    const rowId = newRowObject[rowIdColumn];
    const currentRowTimestamp = await getTimestampForRow(
      tableName,
      timestampFields.updatedAt,
      rowId,
    );
    return (
      currentRowTimestamp === null ||
      newRowObject[timestampFields.updatedAt] > currentRowTimestamp
    );
  });

  const queries: SqlQuery[] = filteredData.map(newRowObject => ({
    sqlStatement: `REPLACE INTO ${tableName} (${columns}) VALUES ${placeholders}`,
    params: Object.values(newRowObject),
  }));

  try {
    const results: ExecutionResult<any>[] = await executeSqlBatch(queries);

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
  } catch (error) {
    logger.error('Error during updating rows:', error);
    throw error;
  }
};
