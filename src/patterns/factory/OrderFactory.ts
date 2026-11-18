import { Order } from "@prisma/client";

export class OrderFactory {
  create(data: { userId: number; status: string; total: number; items?: any[] }): Order {
    return {
      id: 0,
      userId: data.userId,
      status: data.status,
      total: data.total,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Order;
  }

  createPending(userId: number): Order {
    return this.create({ userId, status: "PENDING", total: 0 });
  }

  createCompleted(userId: number, total: number): Order {
    return this.create({ userId, status: "COMPLETED", total });
  }
}