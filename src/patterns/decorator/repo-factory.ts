import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repository/UserRepository";
import { ProductRepository } from "../repository/ProductRepository";
import { LoggingDecorator } from "./decorators";
import { CachingDecorator } from "./decorators";
import { MetricsDecorator } from "./decorators";

// Decorator Pattern Registry
// This shows how decorators can wrap repositories to add cross-cutting concerns

const prisma = new PrismaClient();

// Base repositories
const baseUserRepository = new UserRepository(prisma);
const productRepository = new ProductRepository(prisma);  // Product doesn't use decorator in this example

// Wrap User repository with decorators: Logging -> Metrics -> Caching
const userDecorator = new MetricsDecorator(
  new LoggingDecorator(
    new CachingDecorator(baseUserRepository)
  )
);

// Export both repositories
const repository = {
  user: userDecorator,
  product: productRepository,  // Product directly without decorator wrapping for simplicity
};

export { repository, userDecorator };