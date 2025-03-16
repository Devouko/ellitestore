import { z } from "zod";
import { insertProductSchema } from "@/lib/validator";

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