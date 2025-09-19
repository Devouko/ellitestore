'use server';

import { headers } from 'next/headers';
import { ratelimit } from './ratelimit';

export async function validateRequest() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'anonymous';
  
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    throw new Error('Rate limit exceeded');
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
}