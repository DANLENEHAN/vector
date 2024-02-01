import {convertStats} from '@utils/Conversion';
import {
  BodyStatCreateSchema,
  BodyStatType,
  WeightUnit,
} from '@services/api/swagger/data-contracts';

describe('convertStats', () => {
  it('Converts stats to the target unit', () => {
    // Arrange
    const stats = [
      {
        stat_type: BodyStatType.Weight,
        unit: WeightUnit.Kg,
        user_id: 1,
        value: 1,
      } as BodyStatCreateSchema,
    ];

    // Act
    const result = convertStats({
      stats: stats,
      targetUnit: WeightUnit.Lbs,
    });

    // Assert
    expect(result).toEqual([
      {
        stat_type: BodyStatType.Weight,
        unit: WeightUnit.Lbs,
        user_id: 1,
        value: 2.2,
      } as BodyStatCreateSchema,
    ]);
  });
  it('Converts weight from kg to stone', () => {
    // Arrange
    const stats = [
      {
        stat_type: BodyStatType.Weight,
        unit: WeightUnit.Kg,
        user_id: 1,
        value: 1,
      } as BodyStatCreateSchema,
    ];

    // Act
    const result = convertStats({
      stats: stats,
      targetUnit: WeightUnit.Stone,
    });

    // Assert
    expect(result).toEqual([
      {
        stat_type: BodyStatType.Weight,
        unit: WeightUnit.Stone,
        user_id: 1,
        value: 0.16,
      } as BodyStatCreateSchema,
    ]);
  });
});
