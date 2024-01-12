/**
 *  @fileOverview Conversion utilities.
 *  @description Conversion utilities for converting between different units.
 */
// Types
import {
  StatSchema,
  WaterUnit,
  WeightUnit,
} from '@services/api/swagger/data-contracts';
// Functions
import convert from 'convert-units';

// Constants for bespoke conversions
const STONE_TO_POUNDS = 14;

interface convertUnitParams {
  unit: StatSchema['unit'];
}
/**
 * @description Convert the unit to a format that can be used by the convert-units package.
 *
 * @param unit  The unit to be converted.
 * @returns {string} The converted unit.
 *
 * @example
 * // Example usage:
 * const unit = 'kg';
 * convertUnit(unit);
 * // Returns the converted unit.
 */
const convertUnit = ({unit}: convertUnitParams): string => {
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
      return unit.toLowerCase() as string;
  }
};

interface convertValueParams {
  value: number;
  fromUnit: StatSchema['unit'];
  toUnit: StatSchema['unit'];
}

/**
 * @description Convert the value from the fromUnit to the toUnit.
 *
 * @param value  The value to be converted.
 * @param fromUnit  The unit of the value.
 * @param toUnit  The target unit.
 * @returns {number} The converted value.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * const value = 42;
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

interface unitConversion {
  stats: StatSchema[];
  targetUnit: StatSchema['unit'];
}

/**
 * @description Convert the stats to the target unit.
 *
 * @param stats  The stats to be converted.
 * @param targetUnit  The target unit.
 * @returns {StatSchema[]} The converted stats.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 *
 * @example
 * // Example usage:
 * const stats = [ /* stats * / ];
 * const targetUnit = 'kg';
 * convertStats({stats: stats, targetUnit: targetUnit});
 * // Returns the converted stats.
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
