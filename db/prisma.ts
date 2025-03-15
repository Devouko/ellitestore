import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Validate the DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Create a connection pool using the Neon connection string
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Initialize the Prisma adapter with the Neon connection pool
const adapter = new PrismaNeon(pool);

// Extend the PrismaClient to transform specific fields
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          // Ensure the price is converted to a string (if it's a number)
          return product.price?.toString() ?? '0'; // Fallback to '0' if price is null/undefined
        },
      },
      rating: {
        compute(product) {
          // Ensure the rating is converted to a string (if it's a number)
          return product.rating?.toString() ?? '0'; // Fallback to '0' if rating is null/undefined
        },
      },
    },
  },
});

// Optional: Add error handling for the connection pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Optional: Gracefully shut down the Prisma client and connection pool on application exit
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
});