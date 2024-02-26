// Functions
import {getUserDetails} from '@services/asyncStorage/Functions';
import {getCurrentTimestampTimezone} from '@services/date/Functions';
import {v4 as uuid4} from 'uuid';

// Types
import {
  NutritionType,
  WaterUnit,
  NutritionWeightUnit,
  CaloriesUnit,
} from '@services/api/swagger/data-contracts';
import {insertNutritions} from '@services/db/nutrition/Functions';
import {timestampFields} from '@shared/Constants';
import {TimestampTimezone} from '@services/date/Type';

// Logger
import logger from '@utils/Logger';

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
    const user_id = await getUserDetails('user_id');
    const timestampTimezone: TimestampTimezone = getCurrentTimestampTimezone();

    await insertNutritions([
      {
        nutrition_id: uuid4(),
        user_id: user_id,
        value: value,
        type: statType,
        unit: unitValue,
        [timestampFields.createdAt]: timestampTimezone.timestamp,
        [timestampFields.timezone]: timestampTimezone.timezone,
      },
    ]);
    onSuccessfulCreate();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};
