import {convertValue} from '@utils/Conversion';
import {WeightUnit} from '@services/api/swagger/data-contracts';

describe('convertStats', () => {
  it('Converts stats to the target unit', () => {
    // Arrange
    // Act
    const result = convertValue({
      value: 1,
      fromUnit: WeightUnit.Kg,
      toUnit: WeightUnit.Lbs,
    });

    // Assert
    expect(result).toEqual(2.2046244201837775);
  });

  it('Converts weight from kg to stone', () => {
    // Arrange + Act
    const result = convertValue({
      value: 1,
      toUnit: WeightUnit.Stone,
      fromUnit: WeightUnit.Kg,
    });

    // Assert
    expect(result).toEqual(0.15747317287026982);
  });
});
