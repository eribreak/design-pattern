import { Router, Request, Response, NextFunction } from "express";
import { PaymentContext, CreditCardStrategy, PayPalStrategy, CryptoStrategy } from "./strategy";
import { CreatePaymentDto, PaymentResponse, PaymentStatus } from "../../features/payment/dto";
import { prisma } from "../../database/client";
import { PaymentRepository } from "../../patterns/repository/PaymentRepository";

const router = Router();
const paymentRepository = new PaymentRepository(prisma);

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

export class StrategyController {
  async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, orderId, amount, method }: CreatePaymentDto = req.body;

      const context = new PaymentContext();

      switch (method) {
        case "CREDIT_CARD":
          context.setStrategy(new CreditCardStrategy());
          break;
        case "PAYPAL":
          context.setStrategy(new PayPalStrategy());
          break;
        case "CRYPTO":
          context.setStrategy(new CryptoStrategy());
          break;
        default:
          context.setStrategy(new CreditCardStrategy());
      }

      const result = await context.pay(amount);

      const payment = await paymentRepository.create({
        userId,
        orderId: orderId ?? null,
        amount,
        method,
      });

      const updatedPayment = await paymentRepository.update(payment.id, { status: "COMPLETED" });

      res.json({
        success: true,
        data: mapToPaymentResponse(updatedPayment),
        strategyUsed: context.getStrategyName(),
        gatewayResult: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new StrategyController();
router.post("/checkout", (req, res, next) => controller.checkout(req, res, next));

export default router;