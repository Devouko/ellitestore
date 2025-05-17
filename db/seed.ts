// db/seed.ts
import 'dotenv/config' // <-- add this as the first line

import { PrismaClient } from '@prisma/client';
import sampleData from "./sample-data";
import { prisma } from './prisma';

async function main() {
const prisma = new PrismaClient();
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });

  console.log('Database seeded successfully');
}

main()
  .catch(e => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
