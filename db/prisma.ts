import { PrismaClient } from '@prisma/client';

// Add global type for PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use singleton pattern to prevent multiple instances in development
export const prisma = globalForPrisma.prisma || new PrismaClient();

// Save to global object in non-production environments
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
