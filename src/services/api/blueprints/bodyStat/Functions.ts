// Functions
import {getStats} from '@services/api/blueprints/bodyStat/Api';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuid4} from 'uuid';
import {getBodyStats} from '@services/db/bodyStat/Functions';
import {generateGraphData} from '@services/timeSeries/timeSeries';
import moment from 'moment';

// Constants
import {syncDbTables} from '@shared/Constants';

// Types
import {
  BodyStatType,
  BodyStatCreateSchema,
  UserCreateSchema,
} from '@services/api/swagger/data-contracts';
import {SwaggerValidationError} from '@services/api/Types';
import {insertBodyStat} from '@services/db/bodyStat/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';
import {graphPeriodData} from '@services/timeSeries/Types';

// Logger
import logger from '@utils/Logger';
import {getUser} from '@services/db/user/Functions';

/**
 * Interface for the createNewBodyStat function.
 *
 * @param value  The value of the bodyStat.
 * @param navigation  The navigation object.
 * @param bodyStatType  The type of bodyStat.
 * @param unitValue  The unit of the bodyStat.
 */
export interface createNewBodyStatParams {
  value: number;
  onSuccessfulCreate: () => void;
  statType: BodyStatType;
  unitValue: BodyStatCreateSchema['unit'];
}

/**
 * @description Create a new bodyStat.
 *
 * @param {Object} createNewBodyStatParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the bodyStat is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const createNewBodyStat = async ({
  value,
  unitValue,
  statType,
  onSuccessfulCreate,
}: createNewBodyStatParams): Promise<void> => {
  try {
    const user: UserCreateSchema | null = await getUser();
    const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

    if (user != null) {
      await insertBodyStat([
        {
          body_stat_id: uuid4(),
          unit: unitValue,
          stat_type: statType,
          user_id: user.user_id,
          value: value,
          [timestampFields.createdAt]: timestampTimezone.timestamp,
          [timestampFields.timezone]: timestampTimezone.timezone,
        },
      ]);
      onSuccessfulCreate();
    } else {
      logger.warn('Unable to retrieve user will not insert body stat.');
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

/**
 * Interface for the getUserStats function.
 *
 * @param bodyStatType  The type of bodyStat.
 */
export interface GetUserStatsParams {
  bodyStatType: BodyStatType;
}
/**
 * @description Get the stats.
 *
 * @param {Object} GetUserStatsParams  The interface parameters.
 * @returns {Promise<BodyStatCreateSchema[] | undefined>} A promise that resolves with the stats.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */

export const getUserStats = async ({
  bodyStatType,
}: GetUserStatsParams): Promise<BodyStatCreateSchema[] | undefined> => {
  try {
    const user: UserCreateSchema | null = await getUser();
    if (user != null) {
      const response = await getStats({
        filters: {
          user_id: {eq: user.user_id},
          stat_type: {eq: bodyStatType},
        },
        sort: [`${timestampFields.createdAt}:desc`],
      });
      if (response instanceof SwaggerValidationError) {
        logger.error(`Error: ${response.message}`);
      } else {
        return response;
      }
    } else {
      logger.warn("Unable to retreive user can't get stats.");
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
  return undefined;
};

export const getBodyStatGraphData = async (
  bodyStatType: BodyStatType,
  targetUnit: BodyStatCreateSchema['unit'],
): Promise<graphPeriodData> => {
  const user: UserCreateSchema | null = await getUser();
  if (user != null) {
    const stats = await getBodyStats({
      columns: ['value', 'created_at', 'unit'],
      whereClause: `user_id = '${user.user_id}' AND stat_type = '${bodyStatType}' AND deleted IS false`,
    });
    return generateGraphData({
      table: syncDbTables.bodyStatTable,
      data: stats,
      targetDate: moment.utc(),
      targetUnit: targetUnit,
    });
  } else {
    throw new Error('Unable to retreive user, cannot get body stat data.');
  }
};
