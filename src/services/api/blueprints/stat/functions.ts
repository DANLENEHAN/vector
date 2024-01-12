// Services
import {getUserDetails} from '@services/asyncStorage/functions';
import {getStats} from '@services/api/blueprints/stat/api';
// Types
import {StatType, StatSchema} from '@services/api/swagger/data-contracts';
import {SwaggerValidationError} from '@services/api/types';
import {insertStat} from '@services/db/stat/functions';
// Logger
import logger from '@utils/logger';

export interface CreateNewStatParams {
  value: number;
  navigation: any;
  statType: StatType;
  unitValue: StatSchema['unit'];
}

/**
 * @description Create a new stat.
 *
 * @param value  The value of the stat.
 * @param navigation  The navigation object.
 * @param statType  The type of stat.
 * @param unitValue  The unit of the stat.
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
}: CreateNewStatParams) => {
  try {
    const user_id = await getUserDetails('user_id');
    const currentTimestamp: string = new Date().getTime().toString();
    await insertStat([
      {
        unit: unitValue,
        stat_type: statType,
        user_id: user_id,
        value: value,
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
      },
    ]);
    navigation.goBack();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

export interface GetUserStatsParams {
  statType: StatType;
}
/**
 * @description Get the stats.
 *
 * @returns {Promise<StatSchema[] | undefined>} A promise that resolves with the stats.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * await getStat();
 *
 */

export const getUserStats = async ({statType}: GetUserStatsParams) => {
  try {
    const user_id = await getUserDetails('user_id');
    const response = await getStats({
      filters: {
        user_id: {eq: user_id},
        stat_type: {eq: statType},
      },
      sort: ['created_at:desc'],
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
