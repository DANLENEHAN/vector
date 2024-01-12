// Types
import {Unit} from 'convert-units';
import {
  StatSchema,
  WaterUnit,
  WeightUnit,
} from '@services/api/swagger/data-contracts';
// Functions
import convert from 'convert-units';

// Constants for bespoke conversions
const STONE_TO_POUNDS = 14;

/**
 * Interface for the convertUnit function.
 *
 * @interface convertUnitParams
 *
 * @property {StatSchema['unit']} unit  The unit to be converted.
 */
interface convertUnitParams {
  unit: StatSchema['unit'];
}

/**
 * @description Convert the unit to a format that the convert-units package can understand.
 *
 * @param {convertUnitParams} unit  The unit to be converted.
 * @returns {Unit} The converted unit.
 *
 * @example
 * // Example usage:
 * const unit = 'kg';
 * convertUnit({unit: unit});
 * // Returns the converted unit.
 */
const convertUnit = ({unit}: convertUnitParams): Unit => {
  switch (unit) {
    // Any unit that need conversion should be handled here
    case WeightUnit.Lbs:
      return 'lb';
    case WaterUnit.FlOz:
      return 'fl-oz';
    case WaterUnit.Cups:
      return 'cup';
    // Add other units as needed
    default:
      return unit.toLowerCase() as Unit;
  }
};

/**
 * Interface for the convertValue function.
 *
 * @interface convertValueParams
 *
 * @property {number} value  The value to be converted.
 * @property {StatSchema['unit']} fromUnit  The unit of the value.
 * @property {StatSchema['unit']} toUnit  The target unit.
 */
interface convertValueParams {
  value: number;
  fromUnit: StatSchema['unit'];
  toUnit: StatSchema['unit'];
}

/**
 * @description Convert the value to the target unit.
 *
 * @param {convertValueParams} {value, fromUnit, toUnit}  The value to be converted, the unit of the value, and the target unit.
 * @returns {number} The converted value.
 *
 * @example
 * // Example usage:
 * const value = 1;
 * const fromUnit = 'kg';
 * const toUnit = 'lbs';
 * convertValue({value: value, fromUnit: fromUnit, toUnit: toUnit});
 * // Returns the converted value.
 */
const convertValue = ({
  value,
  fromUnit,
  toUnit,
}: convertValueParams): number => {
  if (fromUnit === toUnit) {
    return value; // No conversion needed
  }

  // Handle stone conversions
  if (fromUnit === WeightUnit.Stone || toUnit === WeightUnit.Stone) {
    if (fromUnit === WeightUnit.Stone && toUnit === WeightUnit.Lbs) {
      return value * STONE_TO_POUNDS;
    } else if (fromUnit === WeightUnit.Lbs && toUnit === WeightUnit.Stone) {
      return value / STONE_TO_POUNDS;
    } else if (fromUnit === WeightUnit.Stone) {
      // Convert from stone to an intermediate unit (pounds), then to the target unit
      const intermediateValue =
        fromUnit === WeightUnit.Stone ? value * STONE_TO_POUNDS : value;
      const convertedValue = convert(intermediateValue)
        .from('lb')
        .to(convertUnit({unit: toUnit}));
      return fromUnit === WeightUnit.Stone
        ? convertedValue
        : convertedValue / STONE_TO_POUNDS;
    } else {
      // Convert from the target unit to an intermediate unit (pounds), then to stone
      const intermediateValue = convert(value)
        .from(convertUnit({unit: fromUnit}))
        .to('lb');
      return intermediateValue / STONE_TO_POUNDS;
    }
  }

  // Use convert-units package for other conversions
  return convert(value)
    .from(convertUnit({unit: fromUnit}))
    .to(convertUnit({unit: toUnit}));
};

/**
 * Interface for the convertStats function.
 *
 * @interface unitConversion
 *
 * @property {StatSchema[]} stats  The stats to be converted.
 * @property {StatSchema['unit']} targetUnit  The target unit.
 */
interface unitConversion {
  stats: StatSchema[];
  targetUnit: StatSchema['unit'];
}

/**
 * Convert the stats to the target unit.
 *
 * @function convertStats
 * @example
 * const stats = [
 *  {
 *   stat_type: StatType.Weight,
 *   unit: WeightUnit.Kg,
 *   user_id: 1,
 *   value: 1,
 *  } as StatSchema,
 * ];
 * convertStats({stats: stats, targetUnit: WeightUnit.Lbs});
 * // Returns the converted stats.
 *
 * @param {unitConversion} {stats, targetUnit} The stats to be converted and the target unit.
 * @returns {StatSchema[]} The converted stats.
 */
export const convertStats = ({
  stats,
  targetUnit,
}: unitConversion): StatSchema[] => {
  return stats.map(stat => ({
    ...stat,
    value: Number(
      convertValue({
        value: stat.value,
        fromUnit: stat.unit,
        toUnit: targetUnit,
      }).toFixed(2),
    ),
    unit: targetUnit,
  }));
};
