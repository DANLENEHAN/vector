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

type MeasurementConfiguration = {
  measurementUnit:
    | typeof MuscleMeasurementUnit
    | typeof WeightUnit
    | typeof HeightUnit
    | typeof WaterUnit
    | typeof CaloriesUnit
    | typeof NutritionWeightUnit;
  statType: BodyStatType | NutritionType;
};

export const MeasurementConfig: {
  [key in BodyStatType | NutritionType]: MeasurementConfiguration;
} = {
  [BodyStatType.BodyMeasurement]: {
    measurementUnit: MuscleMeasurementUnit,
    statType: BodyStatType.BodyMeasurement,
  },
  [BodyStatType.Weight]: {
    measurementUnit: WeightUnit,
    statType: BodyStatType.Weight,
  },
  [BodyStatType.Height]: {
    measurementUnit: HeightUnit,
    statType: BodyStatType.Height,
  },
  [NutritionType.Water]: {
    measurementUnit: WaterUnit,
    statType: NutritionType.Water,
  },
  [NutritionType.Calories]: {
    measurementUnit: CaloriesUnit,
    statType: NutritionType.Calories,
  },
  [NutritionType.Carbohydrates]: {
    measurementUnit: NutritionWeightUnit,
    statType: NutritionType.Carbohydrates,
  },
  [NutritionType.Fat]: {
    measurementUnit: NutritionWeightUnit,
    statType: NutritionType.Fat,
  },
  [NutritionType.Fiber]: {
    measurementUnit: NutritionWeightUnit,
    statType: NutritionType.Fiber,
  },
  [NutritionType.Protein]: {
    measurementUnit: NutritionWeightUnit,
    statType: NutritionType.Protein,
  },
};
