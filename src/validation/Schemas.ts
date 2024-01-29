import {TextValidationRules, LoginValidationKey} from '@validation/Types';

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^[A-Za-z0-9@#$%^&+=]+$/;

export const LoginValidationSchema: Record<
  LoginValidationKey,
  TextValidationRules
> = {
  email: {
    maxLength: 50,
    pattern: emailRegex,
  },
  password: {
    pattern: passwordRegex,
    maxLength: 100,
    minLength: 8,
  },
};
