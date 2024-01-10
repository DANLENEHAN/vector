import {StatSchema} from '../../api/swagger/data-contracts';

import {statTable} from './types';
import {insertRows} from '../functions';

export const insertStat = async (stats: StatSchema[]) => {
  await insertRows(statTable, stats);
};
