import { IUser } from "./IUser";
import { User } from "@prisma/client";

export abstract class BaseUserDecorator implements IUser {
  protected decoratedUser: IUser;

  constructor(decoratedUser: IUser) {
    this.decoratedUser = decoratedUser;
  }

  async findById(id: number): Promise<User | null> {
    return this.decoratedUser.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.decoratedUser.findByEmail(email);
  }

  async findAll(): Promise<User[]> {
    return this.decoratedUser.findAll();
  }

  async create(data: { email: string; name: string; age?: number }): Promise<User> {
    return this.decoratedUser.create(data);
  }

  async update(id: number, data: Partial<{ name: string; age: number }>): Promise<User> {
    return this.decoratedUser.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.decoratedUser.delete(id);
  }
}