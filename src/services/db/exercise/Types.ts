export type ExerciseSearchFilters =
  | 'equipments'
  | 'muscleGroups'
  | 'specificMuscles';

export type ExerciseSearchFiltersSchema = {
  [Key in ExerciseSearchFilters]: Array<string>;
};
