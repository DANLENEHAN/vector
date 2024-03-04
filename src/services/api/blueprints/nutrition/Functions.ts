// Functions
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuid4} from 'uuid';
import {getUser} from '@services/db/user/Functions';
import {getNutritions} from '@services/db/nutrition/Functions';
import moment from 'moment';
import {generateGraphData} from '@services/timeSeries/Functions';

// Types
import {
  NutritionType,
  WaterUnit,
  NutritionWeightUnit,
  CaloriesUnit,
  UserCreateSchema,
} from '@services/api/swagger/data-contracts';
import {insertNutritions} from '@services/db/nutrition/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';
import {graphPeriodData} from '@services/timeSeries/Types';
import {syncDbTables} from '@shared/Constants';

// Logger
import logger from '@utils/Logger';

// Ge

/**
 * Interface for the CreateNewNutritionParams function.
 *
 * @param value  The value of the nutrition entry.
 * @param navigation  The navigation object.
 * @param type  The type of the nutrition.
 * @param unit  The unit of the nutrition.
 */
export interface CreateNewNutritionParams {
  value: number;
  unitValue: WaterUnit | NutritionWeightUnit | CaloriesUnit;
  statType: NutritionType;
  onSuccessfulCreate: () => void;
}

/**
 * @description Create a new Nutrition.
 *
 * @param {Object} CreateNewNutritionParams  The interface parameters.
 * @returns {Promise<void>} A promise that resolves when the nutrition is successfully created.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 */
export const createNewNutrition = async ({
  value,
  unitValue,
  statType,
  onSuccessfulCreate,
}: CreateNewNutritionParams): Promise<void> => {
  try {
    const user: UserCreateSchema | null = await getUser();
    const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

    if (user != null) {
      await insertNutritions([
        {
          nutrition_id: uuid4(),
          user_id: user.user_id,
          value: value,
          type: statType,
          unit: unitValue,
          [timestampFields.createdAt]: timestampTimezone.timestamp,
          [timestampFields.timezone]: timestampTimezone.timezone,
        },
      ]);
      onSuccessfulCreate();
    } else {
      logger.warn('Unable to retrieve user will not insert nutrition.');
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

export const getNutritionGraphData = async (
  nutritionType: NutritionType,
  targetUnit: NutritionWeightUnit | WaterUnit | CaloriesUnit,
): Promise<graphPeriodData> => {
  const user: UserCreateSchema | null = await getUser();
  if (user != null) {
    const stats = await getNutritions({
      columns: ['value', 'created_at', 'unit'],
      whereClause: `user_id = '${user.user_id}' AND type = '${nutritionType}' AND deleted IS false`,
    });
    return generateGraphData({
      table: syncDbTables.nutritionTable,
      data: stats,
      targetDate: moment.utc(),
      targetUnit: targetUnit,
    });
  } else {
    throw new Error('Unable to retreive user, cannot get body stat data.');
  }
};
