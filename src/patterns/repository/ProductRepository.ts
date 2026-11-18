import { PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "./interfaces";

export class ProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  }

  async create(data: { name: string; description: string; price: number; stock: number }): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: Partial<{ name: string; description: string; price: number; stock: number }>): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async incrementStock(id: number, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
  }

  async decrementStock(id: number, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}