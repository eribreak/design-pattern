import { Product } from "@prisma/client";

export interface IProduct {
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(data: { name: string; description: string; price: number; stock: number }): Promise<Product>;
  update(id: number, data: Partial<{ name: string; description: string; price: number; stock: number }>): Promise<Product>;
  delete(id: number): Promise<void>;
  incrementStock(id: number, quantity: number): Promise<Product>;
  decrementStock(id: number, quantity: number): Promise<Product>;
}