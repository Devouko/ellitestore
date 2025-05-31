import 'dotenv/config'; // loads environment variables from .env
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("ENV:", process.env.DATABASE_URL);

  // Use lowercase 'product' here:
  const products = await prisma.product.findMany();
  console.log(products);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
