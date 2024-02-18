// Types
import {
  WeightUnit,
  BodyStatType,
  HeightUnit,
  MuscleMeasurementUnit,
  NutritionType,
  WaterUnit,
  CaloriesUnit,
  NutritionWeightUnit,
} from '@services/api/swagger/data-contracts';

type MeasurementUnitType =
  | typeof MuscleMeasurementUnit
  | typeof WeightUnit
  | typeof HeightUnit
  | typeof WaterUnit
  | typeof CaloriesUnit
  | typeof NutritionWeightUnit;

export const MeasurementConfig: {
  [key in BodyStatType | NutritionType]: MeasurementUnitType;
} = {
  [BodyStatType.Chest]: MuscleMeasurementUnit,
  [BodyStatType.Glutes]: MuscleMeasurementUnit,
  [BodyStatType.Hips]: MuscleMeasurementUnit,
  [BodyStatType.LowerArm]: MuscleMeasurementUnit,
  [BodyStatType.LowerLeg]: MuscleMeasurementUnit,
  [BodyStatType.Neck]: MuscleMeasurementUnit,
  [BodyStatType.Shoulders]: MuscleMeasurementUnit,
  [BodyStatType.UpperLeg]: MuscleMeasurementUnit,
  [BodyStatType.UpperArm]: MuscleMeasurementUnit,
  [BodyStatType.Waist]: MuscleMeasurementUnit,
  [BodyStatType.Weight]: WeightUnit,
  [BodyStatType.Height]: HeightUnit,
  [NutritionType.Water]: WaterUnit,
  [NutritionType.Calories]: CaloriesUnit,
  [NutritionType.Carbohydrates]: NutritionWeightUnit,
  [NutritionType.Fat]: NutritionWeightUnit,
  [NutritionType.Fiber]: NutritionWeightUnit,
  [NutritionType.Protein]: NutritionWeightUnit,
};
