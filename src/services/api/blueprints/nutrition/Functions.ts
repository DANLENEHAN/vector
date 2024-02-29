// Functions
import {getUtcNowAndDeviceTimezone} from '@services/date/Functions';
import {v4 as uuid4} from 'uuid';
import {getUser} from '@services/db/user/Functions';

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
    const user: UserCreateSchema | null = await getUser();
    const timestampTimezone: TimestampTimezone = getUtcNowAndDeviceTimezone();

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
