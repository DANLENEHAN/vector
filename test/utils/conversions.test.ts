import {convertStats} from '../../src/utils/conversion';
import {
  StatSchema,
  StatType,
  WeightUnit,
} from '../../src/services/api/swagger/data-contracts';

describe('convertStats', () => {
  it('Converts stats to the target unit', () => {
    // Arrange
    const stats = [
      {
        stat_type: StatType.Weight,
        unit: WeightUnit.Kg,
        user_id: 1,
        value: 1,
      } as StatSchema,
    ];

    // Act
    const result = convertStats({
      stats: stats,
      targetUnit: WeightUnit.Lbs,
    });

    // Assert
    expect(result).toEqual([
      {
        stat_type: StatType.Weight,
        unit: WeightUnit.Lbs,
        user_id: 1,
        value: 2.2,
      } as StatSchema,
    ]);
  });
  it('Converts weight from kg to stone', () => {
    // Arrange
    const stats = [
      {
        stat_type: StatType.Weight,
        unit: WeightUnit.Kg,
        user_id: 1,
        value: 1,
      } as StatSchema,
    ];

    // Act
    const result = convertStats({
      stats: stats,
      targetUnit: WeightUnit.Stone,
    });

    // Assert
    expect(result).toEqual([
      {
        stat_type: StatType.Weight,
        unit: WeightUnit.Stone,
        user_id: 1,
        value: 0.16,
      } as StatSchema,
    ]);
  });
});
