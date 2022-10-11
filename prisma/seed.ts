import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  for (let j = 0; j < 10; j++) {
    const shop = await prisma.shop.create({
      data: {
        location: {
          type: "Point",
          coordinates: [42.562309, 12.64576],
        },
        status: "active",
        name: `shop number ${j}`,
        street: `via cavour ${j}`,
      },
    });

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
          shopId: shop.id,
          brand: `brand ${i}`,
        },
      });
    }
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
