import { prisma } from "./client";
import { logger } from "../shared/logger";

async function seed() {
  logger.info("Starting seed...");

  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      { email: "john@example.com", name: "John Doe", age: 30 },
      { email: "jane@example.com", name: "Jane Smith", age: 25 },
    ],
    skipDuplicates: true,
  });
  logger.info(`Created ${users.count} users`);

  // Seed Products
  const products = await prisma.product.createMany({
    data: [
      { name: "Laptop", description: "High performance laptop", price: 999.99, stock: 10 },
      { name: "Mouse", description: "Wireless mouse", price: 29.99, stock: 100 },
      { name: "Keyboard", description: "Mechanical keyboard", price: 79.99, stock: 50 },
    ],
    skipDuplicates: true,
  });
  logger.info(`Created ${products.count} products`);

  // Create test orders
  const user = await prisma.user.findUnique({ where: { email: "john@example.com" } });
  if (user) {
    await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        total: 1029.97,
        items: {
          create: [
            { productId: 1, quantity: 1, unitPrice: 999.99 },
            { productId: 2, quantity: 1, unitPrice: 29.99 },
            { productId: 3, quantity: 1, unitPrice: 79.99 },
          ],
        },
        payments: {
          create: {
            amount: 1029.97,
            method: "CREDIT_CARD",
            status: "COMPLETED",
            user: { connect: { id: user.id } },
          },
        },
      },
    });
    logger.info("Created test order for John");
  }

  logger.info("Seed completed!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  logger.error(e);
  process.exit(1);
});