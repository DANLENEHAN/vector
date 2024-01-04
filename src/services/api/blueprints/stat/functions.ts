// Services
import {getUserDetails} from '../../../asyncStorage/functions';
import {createStat} from './api';
// Types
import {StatType, StatSchema} from '../../swagger/data-contracts';

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
 */
export const createNewStat = async ({
  value,
  navigation,
  statType,
  unitValue,
}: CreateNewStatParams) => {
  try {
    const user_id = await getUserDetails('user_id');
    await createStat({
      unit: unitValue,
      stat_type: statType,
      user_id: user_id,
      value: value,
    });
    navigation.goBack();
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};
