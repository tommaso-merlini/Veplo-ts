import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        name: `name Product${i}`,
        price: i,
        sizes: [`${i}`],
        category: `${i}`,
        types: [`${i}`],
        colors: [`colors Product${i}`],
        location: {
          type: "Point",
          coordinates: [42.562309, 12.64576],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
