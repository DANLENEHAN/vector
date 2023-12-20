export interface LoginUserSchema {
  email: string;
  password: string;
}

export interface UserCreateSchema {
  age: number;
  birthday: string;
  date_format_pref: DateFormat;
  email: string;
  first_name: string;
  gender: Gender;
  goal: FitnessGoal;
  height_unit_pref: HeightUnit;
  language: string;
  last_name: string;
  password: string;
  phone_number: string;
  premium: boolean;
  status: ProfileStatus;
  username: string;
  weight_unit_pref: WeightUnit;
}

export interface UserGetSchema {
  user_id: number;
  username: string;
  email: string;
  status: 'active' | 'inactive';
  profile_link: string | null;
  premium: boolean;
  age: number;
  birthday: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  phone_number: string;
  height_unit_pref: 'cm' | 'in';
  weight_unit_pref: 'kg' | 'lb';
  date_format_pref: string;
  language: string;
  goal: string;
  superuser: boolean;
}

// NOTE: Swap to enums when they are available...
export interface DateFormat {}

export interface Gender {}

export interface FitnessGoal {}

export interface HeightUnit {}

export interface WeightUnit {}

export interface ProfileStatus {}
