import {TextValidationRules} from './Types';

export const emailRegex = /^[w.-]+@[a-zA-Zd.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^[A-Za-z0-9@#$%^&+=]+$/;

// Define a union type for the allowed keys
type LoginValidationKey = 'email' | 'password';

// Use the union type for the keys in LoginValidationSchema
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
