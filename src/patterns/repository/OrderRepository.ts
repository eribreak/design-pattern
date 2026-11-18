import { PrismaClient, Order } from "@prisma/client";
import { IOrderRepository } from "./interfaces";

export class OrderRepository implements IOrderRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: { userId: number; status: string; total: number; items: any[] }): Promise<Order> {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        status: data.status,
        total: data.total,
        items: {
          create: data.items,
        },
      },
      include: { items: true },
    });
  }

  async update(id: number, data: Partial<{ status: string; total: number }>): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }
}