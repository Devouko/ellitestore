import { z } from 'zod';
import { formatNumberWithDecimalPlaces } from './utils';

const currency = z
  .string()
  .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimalPlaces(Number(value))));

// schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have at least 1 image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency
});

// cart items
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image is required'),
  price: currency
});

// the cart items schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'session cart id is required'),
  userId: z.string().optional().nullable(),
});

// schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email('Email is not valid'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signUpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(3, "Email must be at least 3 characters").email("Invalid email"),
  password: z.string().min(3, "Password must be at least 3 characters"),
  confirmPassword: z.string().min(3, "Confirm Password must be at least 3 characters")
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});