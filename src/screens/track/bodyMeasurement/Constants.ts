// Constants
import {MeasureableBodyparts} from '@components/visualisations/BodyMap/Constants';
// Types
import {
  WeightUnit,
  BodyStatType,
  HeightUnit,
  MuscleMeasurementUnit,
} from '@services/api/swagger/data-contracts';

export interface MuscleConfig {
  howToMeasure: string;
  image: string | null;
}

export const BodyMeasurementConfig = {
  [BodyStatType.BodyMeasurement]: {
    measurementUnit: MuscleMeasurementUnit,
    bodyStatType: BodyStatType.BodyMeasurement,
  },
  [BodyStatType.Weight]: {
    measurementUnit: WeightUnit,
    bodyStatType: BodyStatType.Weight,
  },
  [BodyStatType.Height]: {
    measurementUnit: HeightUnit,
    bodyStatType: BodyStatType.Height,
  },
};

export const MuscleToConfig: {
  [key in MeasureableBodyparts]?: MuscleConfig;
} = {
  [MeasureableBodyparts.Chest]: {
    howToMeasure: 'Wrap that shit around your chest motherfucker',
    image: null,
  },
  [MeasureableBodyparts.Neck]: {
    howToMeasure: 'Wrap that shit around your Neck motherfucker',
    image: null,
  },
  [MeasureableBodyparts.Waist]: {
    howToMeasure: 'Wrap that shit around your Waist motherfucker',
    image: null,
  },
};
