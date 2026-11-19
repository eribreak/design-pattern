import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/client";
import { PaymentRepository } from "../../patterns/repository/PaymentRepository";
import { CreatePaymentDto, PaymentResponse, PaymentStatus } from "./dto";
import { PaymentContext, CreditCardStrategy, PayPalStrategy, CryptoStrategy } from "../../patterns/strategy/strategy";
import { CircuitBreaker } from "../../patterns/circuit-breaker/CircuitBreaker";
import { IPaymentGateway, PaymentGatewayResult, MockAdapter } from "../../patterns/adapter/adapters";

const paymentRepository = new PaymentRepository(prisma);
const mockGateway = new MockAdapter();

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

const paymentCircuitBreaker = new CircuitBreaker<PaymentResult>({
  failureThreshold: 3,
  resetTimeout: 5000,
});

function mapToPaymentResponse(payment: any): PaymentResponse {
  return {
    id: payment.id,
    userId: payment.userId,
    orderId: payment.orderId,
    amount: payment.amount,
    method: payment.method as any,
    status: payment.status as PaymentStatus,
    createdAt: payment.createdAt,
  };
}

export class PaymentController {
  private getStrategy(method: string): CreditCardStrategy | PayPalStrategy | CryptoStrategy {
    switch (method) {
      case "PAYPAL":
        return new PayPalStrategy();
      case "CRYPTO":
        return new CryptoStrategy();
      case "CREDIT_CARD":
      default:
        return new CreditCardStrategy();
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, orderId, amount, method }: CreatePaymentDto = req.body;

      const context = new PaymentContext();
      context.setStrategy(this.getStrategy(method));

      let result: PaymentGatewayResult;
      try {
        result = await paymentCircuitBreaker.execute(() => mockGateway.charge(amount));
      } catch (_error) {
        res.status(503).json({ success: false, error: "Payment service unavailable" });
        return;
      }

      const payment = await paymentRepository.create({
        userId,
        orderId: orderId ?? null,
        amount,
        method,
      });

      const updatedPayment = await paymentRepository.update(payment.id, { status: PaymentStatus.COMPLETED });

      res.status(201).json({
        success: true,
        data: mapToPaymentResponse(updatedPayment),
        gatewayResult: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await paymentRepository.findByUserId(Number(req.params.userId));
      res.json({ success: true, data: payments.map(mapToPaymentResponse) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await paymentRepository.findById(Number(req.params.id));
      if (!payment) {
        res.status(404).json({ success: false, error: "Payment not found" });
        return;
      }
      res.json({ success: true, data: mapToPaymentResponse(payment) });
    } catch (error) {
      next(error);
    }
  }
}