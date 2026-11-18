import { PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "./interfaces";

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(page = 1, limit = 10): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: { email: string; name: string; age?: number }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Partial<{ name: string; age: number }>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}