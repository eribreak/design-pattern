import { User, Product, Order, Payment } from "@prisma/client";

// Repository interfaces define the contract - follows Interface Segregation Principle

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(page?: number, limit?: number): Promise<User[]>;
  create(data: { email: string; name: string; age?: number }): Promise<User>;
  update(id: number, data: Partial<{ name: string; age: number }>): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(data: { name: string; description: string; price: number; stock: number }): Promise<Product>;
  update(id: number, data: Partial<{ name: string; description: string; price: number; stock: number }>): Promise<Product>;
  delete(id: number): Promise<void>;
  incrementStock(id: number, quantity: number): Promise<Product>;
  decrementStock(id: number, quantity: number): Promise<Product>;
}

export interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  create(data: { userId: number; status: string; total: number; items: any[] }): Promise<Order>;
  update(id: number, data: Partial<{ status: string; total: number }>): Promise<Order>;
  delete(id: number): Promise<void>;
}

export interface IPaymentRepository {
  findById(id: number): Promise<Payment | null>;
  findByUserId(userId: number): Promise<Payment[]>;
  findByOrderId(orderId: number): Promise<Payment[]>;
  create(data: { userId: number; orderId: number | null; amount: number; method: string }): Promise<Payment>;
  update(id: number, data: Partial<{ status: string }>): Promise<Payment>;
}