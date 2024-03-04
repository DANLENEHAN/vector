import {insertNutritions} from '@services/db/nutrition/Functions';
import * as DbFunctions from '@services/db/Functions';
import {
  NutritionType,
  WaterUnit,
  NutritionWeightUnit,
} from '@services/api/swagger/data-contracts';
import {NutritionCreateSchema} from '@services/api/swagger/data-contracts';

describe('Test nutrition functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('insertNutritions works', async () => {
    // Arrange
    const testStats = [
      {
        nutrition_id: '1',
        user_id: '1',
        value: 1,
        unit: WaterUnit.Cups,
        type: NutritionType.Water,
        created_at: '2025-01-01T00:00:00.000',
        timezone: 'UTC',
      },
      {
        nutrition_id: '2',
        user_id: '1',
        value: 2,
        unit: NutritionWeightUnit.G,
        created_at: '2025-01-01T00:00:00.000',
        type: NutritionType.Carbohydrates,
        timezone: 'UTC',
      },
    ] as NutritionCreateSchema[];
    const mockInsertRows = jest
      .spyOn(DbFunctions, 'insertRows')
      .mockResolvedValueOnce();
    // Act
    await insertNutritions(testStats);
    // Assert
    expect(mockInsertRows).toHaveBeenCalledTimes(1);
    expect(mockInsertRows).toHaveBeenCalledWith('nutrition', testStats);
  });
});
