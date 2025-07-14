import { z, ZodNullDef } from "zod";
import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  shippingAddressSchema,
  paymentResultSchema,
} from '@/lib/validator';
/**
 * Represents a product in the application.
 * Extends the base schema for inserting products with additional fields like `id`, `rating`, and `createdAt`.
 */
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date; // Optional: Add updatedAt if your schema includes it
};

export type Cart =z.infer<typeof insertCartSchema>
export type CartItem =z.infer<typeof cartItemSchema>
export type shippingAddress =z.infer<typeof
shippingAddressSchema>

export type OrderItem=z.infer<typeof insertOrderItemSchema>
export type Order=z.infer<typeof insertOrderSchema> & {
  id:string;
  createdAt:Date;
  isPaid:Boolean
  paidAt:Data | null
  isDelivered:Boolean

  deliveredAt :Date | null
  orderItems:OrderItem[],
  user:{name: string; email:string}

}
export type PaymentResult=z.infer<typeof paymentResultSchema>

/**
 * Represents the props passed to a Next.js page component.
 * Includes the `params` object for dynamic routes.
 */
export interface PageProps {
  params: {
    slug: string; // Example: Dynamic route parameter
  };
  searchParams?: {
    [key: string]: string | string[] | undefined; // Optional: Query parameters
  };
}