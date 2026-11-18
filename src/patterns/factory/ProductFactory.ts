import { Product } from "@prisma/client";

export class ProductFactory {
  create(data: { name: string; description: string; price: number; stock: number }): Product {
    return {
      id: 0,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;
  }

  createForSeed(name: string, description: string, price: number, stock: number): Product {
    return this.create({ name, description, price, stock });
  }
}