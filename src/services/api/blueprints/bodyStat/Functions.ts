// Functions
import {getUserDetails} from '@services/asyncStorage/Functions';
import {getStats} from '@services/api/blueprints/bodyStat/Api';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuidv4} from 'uuid';

// Types
import {
  BodyStatType,
  BodyStatCreateSchema,
} from '@services/api/swagger/data-contracts';
import {SwaggerValidationError} from '@services/api/Types';
import {insertStat} from '@services/db/bodyStat/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';

// Logger
import logger from '@utils/Logger';

/**
 * Interface for the createNewStat function.
 *
 * @param value  The value of the bodyStat.
 * @param navigation  The navigation object.
 * @param bodyStatType  The type of bodyStat.
 * @param unitValue  The unit of the bodyStat.
 */
export interface CreateNewStatParams {
  value: number;
  navigation: any;
  bodyStatType: BodyStatType;
  unitValue: BodyStatCreateSchema['unit'];
}

/**
 * @description Create a new bodyStat.
 *
 * @param {Object} CreateNewStatParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the bodyStat is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * const value = 42;
 * const navigation = { /* navigation object * / };
 * const bodyStatType = 'weight';
 * const unitValue = 'kg';
 * await createNewStat({value: value, navigation: navigation, bodyStatType: bodyStatType, unitValue: unitValue});
 *
 */
export const createNewStat = async ({
  value,
  navigation,
  bodyStatType,
  unitValue,
}: CreateNewStatParams): Promise<void> => {
  try {
    const user_id = await getUserDetails('user_id');
    const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

    await insertStat([
      {
        body_stat_id: uuidv4(),
        unit: unitValue,
        stat_type: bodyStatType,
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
 *
 * @example
 * // Example usage:
 * await getStat();
 *
 */

export const getUserStats = async ({
  bodyStatType,
}: GetUserStatsParams): Promise<BodyStatCreateSchema[] | undefined> => {
  try {
    const user_id = await getUserDetails('user_id');
    const response = await getStats({
      filters: {
        user_id: {eq: user_id},
        stat_type: {eq: bodyStatType},
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