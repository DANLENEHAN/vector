// Functions
import {
  deviceTimestampNow,
  getUtcNowAndDeviceTimezone,
} from '@services/date/Functions';
import 'react-native-get-random-values';
import {v4 as uuid4} from 'uuid';
import moment from 'moment-timezone';
import {generateGraphData} from '@services/timeSeries/timeSeries';
import {getEarliestLookbackDate} from '@services/timeSeries/Functions';
import {getRows} from '@services/db/Operations';
import {insertNutritions} from '@services/db/nutrition/Functions';
import {getUser} from '@services/db/user/Functions';

// Types
import {
  NutritionType,
  WaterUnit,
  NutritionWeightUnit,
  CaloriesUnit,
  UserCreateSchema,
  NutritionCreateSchema,
} from '@services/api/swagger/data-contracts';
import {TimestampTimezone} from '@services/date/Type';
import {graphPeriodData, statisticType} from '@services/timeSeries/Types';

import {
  BaseOperators,
  NumericOperators,
} from '@services/api/swagger/data-contracts';
//Constants
import {syncDbTables} from '@shared/Constants';
import {timestampFields} from '@shared/Constants';
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

export const getNutritionGraphData = async (
  nutritionType: NutritionType,
  targetUnit: NutritionWeightUnit | WaterUnit | CaloriesUnit,
  statType: statisticType,
): Promise<graphPeriodData> => {
  const user: UserCreateSchema | null = await getUser();
  if (user != null) {
    const timestampNow = deviceTimestampNow();
    const minStartDate = getEarliestLookbackDate(timestampNow.clone());
    const nutritionData = await getRows<NutritionCreateSchema>({
      tableName: syncDbTables.nutritionTable,
      selectColumns: ['value', 'created_at', 'unit'],
      whereConditions: {
        [timestampFields.createdAt]: {
          [NumericOperators.Ge]: minStartDate.startOf('day'),
          [NumericOperators.Le]: timestampNow.endOf('day'),
        },
        user_id: {
          [BaseOperators.Eq]: user.user_id,
        },
        type: {
          [BaseOperators.Eq]: nutritionType,
        },
      },
    });
    return generateGraphData({
      table: syncDbTables.nutritionTable,
      data: nutritionData || [],
      targetDate: moment(),
      targetUnit: targetUnit,
      statType: statType,
    });
  } else {
    throw new Error('Unable to retreive user, cannot get nutrition data.');
  }
};
