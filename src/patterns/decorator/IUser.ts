import { User } from "@prisma/client";

export interface IUser {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: { email: string; name: string; age?: number }): Promise<User>;
  update(id: number, data: Partial<{ name: string; age: number }>): Promise<User>;
  delete(id: number): Promise<void>;
}