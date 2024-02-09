// Types
import {Unit} from 'convert-units';
import {
  BodyStatCreateSchema,
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
 * @property {BodyStatCreateSchema['unit']} unit  The unit to be converted.
 */
interface convertUnitParams {
  unit: BodyStatCreateSchema['unit'];
}

/**
 * @description Convert the unit to a format that the convert-units package can understand.
 * @param {convertUnitParams} unit  The unit to be converted.
 * @returns {Unit} The converted unit.
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
 * @property {BodyStatCreateSchema['unit']} fromUnit  The unit of the value.
 * @property {BodyStatCreateSchema['unit']} toUnit  The target unit.
 */
interface convertValueParams {
  value: number;
  fromUnit: BodyStatCreateSchema['unit'];
  toUnit: BodyStatCreateSchema['unit'];
}

/**
 * @description Convert the value to the target unit.
 * @param {convertValueParams} {value, fromUnit, toUnit}  The value to be converted, the unit of the value, and the target unit.
 * @returns {number} The converted value.
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
 * @property {BodyStatCreateSchema[]} stats  The stats to be converted.
 * @property {BodyStatCreateSchema['unit']} targetUnit  The target unit.
 */
interface unitConversion {
  stats: BodyStatCreateSchema[];
  targetUnit: BodyStatCreateSchema['unit'];
}

/**
 * Convert the stats to the target unit.
 *
 * @function convertStats
 * @param {unitConversion} {stats, targetUnit} The stats to be converted and the target unit.
 * @returns {BodyStatCreateSchema[]} The converted stats.
 */
export const convertStats = ({
  stats,
  targetUnit,
}: unitConversion): BodyStatCreateSchema[] => {
  return stats.map(bodyStat => ({
    ...bodyStat,
    value: Number(
      convertValue({
        value: bodyStat.value,
        fromUnit: bodyStat.unit,
        toUnit: targetUnit,
      }).toFixed(2),
    ),
    unit: targetUnit,
  }));
};
