export enum StatType {
  Height = 'height',
  Weight = 'weight',
  Feeling = 'feeling',
  Water = 'water',
  Calories = 'calories',
  Steps = 'steps',
}

export interface StatSchema {
  note?: string;
  stat_type: StatType;
  unit: string;
  user_id: number;
  value: number;
}

export enum WeightUnit {
  KG = 'KG',
  LBS = 'LBS',
}

export enum WaterUnit {
  ML = 'ML',
  OZ = 'FL OZ',
}
