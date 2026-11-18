import { Payment } from "@prisma/client";

export class PaymentFactory {
  create(data: { userId: number; orderId: number | null; amount: number; method: string; status?: string }): Payment {
    return {
      id: 0,
      userId: data.userId,
      orderId: data.orderId ?? null,
      amount: data.amount,
      method: data.method,
      status: data.status ?? "PENDING",
      createdAt: new Date(),
    } as Payment;
  }

  createPending(userId: number, amount: number): Payment {
    return this.create({ userId, orderId: null, amount, method: "CREDIT_CARD" });
  }

  createCompleted(userId: number, orderId: number, amount: number): Payment {
    return this.create({ userId, orderId, amount, method: "CREDIT_CARD", status: "COMPLETED" });
  }
}