import { Product } from "@prisma/client";

export class ProductBuilder {
  private product: Partial<Product> = {};

  withId(id: number): ProductBuilder {
    this.product.id = id;
    return this;
  }

  withName(name: string): ProductBuilder {
    this.product.name = name;
    return this;
  }

  withDescription(description: string): ProductBuilder {
    this.product.description = description;
    return this;
  }

  withPrice(price: number): ProductBuilder {
    this.product.price = price;
    return this;
  }

  withStock(stock: number): ProductBuilder {
    this.product.stock = stock;
    return this;
  }

  withCreatedAt(date: Date): ProductBuilder {
    this.product.createdAt = date;
    return this;
  }

  withUpdatedAt(date: Date): ProductBuilder {
    this.product.updatedAt = date;
    return this;
  }

  build(): Omit<Product, "id"> & { name: string; description: string; price: number; stock: number } {
    return {
      name: this.product.name!,
      description: this.product.description!,
      price: this.product.price!,
      stock: this.product.stock!,
      createdAt: this.product.createdAt ?? new Date(),
      updatedAt: this.product.updatedAt ?? new Date(),
    };
  }

  reset(): ProductBuilder {
    this.product = {};
    return this;
  }
}