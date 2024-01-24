// Functions
import {getUserDetails} from '@services/asyncStorage/Functions';
import {getStats} from '@services/api/blueprints/stat/Api';
import {getCurrentTimestampTimezone} from '@services/date/Functions';

// Types
import {StatType, StatCreateSchema} from '@services/api/swagger/data-contracts';
import {SwaggerValidationError} from '@services/api/Types';
import {insertStat} from '@services/db/stat/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';

// Logger
import logger from '@utils/Logger';

/**
 * Interface for the createNewStat function.
 *
 * @param value  The value of the stat.
 * @param navigation  The navigation object.
 * @param statType  The type of stat.
 * @param unitValue  The unit of the stat.
 */
export interface CreateNewStatParams {
  value: number;
  navigation: any;
  statType: StatType;
  unitValue: StatCreateSchema['unit'];
}

/**
 * @description Create a new stat.
 *
 * @param {Object} CreateNewStatParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the stat is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * const value = 42;
 * const navigation = { /* navigation object * / };
 * const statType = 'weight';
 * const unitValue = 'kg';
 * await createNewStat({value: value, navigation: navigation, statType: statType, unitValue: unitValue});
 *
 */
export const createNewStat = async ({
  value,
  navigation,
  statType,
  unitValue,
}: CreateNewStatParams): Promise<void> => {
  try {
    const user_id = await getUserDetails('user_id');
    const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

    await insertStat([
      {
        unit: unitValue,
        stat_type: statType,
        user_id: user_id,
        value: value,
        [timestampFields.createdAt]: timestampTimezone.timestamp,
        [timestampFields.timezone]: timestampTimezone.timezone,
      },
    ]);
    navigation.goBack();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

/**
 * Interface for the getUserStats function.
 *
 * @param statType  The type of stat.
 */
export interface GetUserStatsParams {
  statType: StatType;
}
/**
 * @description Get the stats.
 *
 * @param {Object} GetUserStatsParams  The interface parameters.
 * @returns {Promise<StatCreateSchema[] | undefined>} A promise that resolves with the stats.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * await getStat();
 *
 */

export const getUserStats = async ({
  statType,
}: GetUserStatsParams): Promise<StatCreateSchema[] | undefined> => {
  try {
    const user_id = await getUserDetails('user_id');
    const response = await getStats({
      filters: {
        user_id: {eq: user_id},
        stat_type: {eq: statType},
      },
      sort: [`${timestampFields.createdAt}:desc`],
    });
    if (response instanceof SwaggerValidationError) {
      logger.error(`Error: ${response.message}`);
    } else {
      return response;
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
  return undefined;
};
