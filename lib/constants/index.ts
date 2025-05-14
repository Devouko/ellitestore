// lib/constants.ts

// Environment-based constants
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Ellitestore';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Get all goods and services at one place';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCT_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCT_LIMIT) || 4;

// Form default values
export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

// Validation schemas (consider adding if needed)
export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};