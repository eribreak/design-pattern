import { PrismaClient, Payment } from "@prisma/client";
import { IPaymentRepository } from "./interfaces";

export class PaymentRepository implements IPaymentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByOrderId(orderId: number): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: { userId: number; orderId: number | null; amount: number; method: string }): Promise<Payment> {
    // Validate orderId exists if provided (FK constraint)
    if (data.orderId !== null) {
      const order = await this.prisma.order.findUnique({ where: { id: data.orderId } });
      if (!order) {
        throw new Error(`Order with id ${data.orderId} not found`);
      }
    }
    return this.prisma.payment.create({ data });
  }

  async update(id: number, data: Partial<{ status: string }>): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }
}