import { Router, Request, Response, NextFunction } from "express";
import { PaymentGatewayFactory, StripeAdapter, PayPalAdapter } from "./adapters";
import { prisma } from "../../database/client";
import { PaymentRepository } from "../../patterns/repository/PaymentRepository";
import { PaymentStatus } from "../../features/payment/dto";

const router = Router();
const paymentRepository = new PaymentRepository(prisma);

export class AdapterController {
  async mockPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount = 100 } = req.body;
      const gateway = PaymentGatewayFactory.create("MOCK");
      const result = await gateway.charge(amount);

      const payment = await paymentRepository.create({
        userId: 1,
        orderId: null,
        amount,
        method: "CREDIT_CARD",
      });

      res.json({
        success: true,
        data: result,
        adapter: gateway.getProviderName(),
        paymentId: payment.id,
      });
    } catch (error) {
      next(error);
    }
  }

  async stripePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount = 100 } = req.body;
      const gateway = new StripeAdapter();
      const result = await gateway.charge(amount);

      const payment = await paymentRepository.create({
        userId: 1,
        orderId: null,
        amount,
        method: "CREDIT_CARD",
      });
      await paymentRepository.update(payment.id, { status: PaymentStatus.COMPLETED });

      res.json({
        success: true,
        data: result,
        adapter: gateway.getProviderName(),
        paymentId: payment.id,
      });
    } catch (error) {
      next(error);
    }
  }

  async paypalPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount = 100 } = req.body;
      const gateway = new PayPalAdapter();
      const result = await gateway.charge(amount);

      const payment = await paymentRepository.create({
        userId: 1,
        orderId: null,
        amount,
        method: "PAYPAL",
      });
      await paymentRepository.update(payment.id, { status: PaymentStatus.COMPLETED });

      res.json({
        success: true,
        data: result,
        adapter: gateway.getProviderName(),
        paymentId: payment.id,
      });
    } catch (error) {
      next(error);
    }
  }

  async testAdapter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type = "MOCK", amount = 50 } = req.body;
      const gateway = PaymentGatewayFactory.create(type);
      const result = await gateway.charge(amount);

      res.json({
        success: true,
        data: result,
        adapter: gateway.getProviderName(),
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new AdapterController();
router.post("/mock", (req, res, next) => controller.mockPayment(req, res, next));
router.post("/stripe", (req, res, next) => controller.stripePayment(req, res, next));
router.post("/paypal", (req, res, next) => controller.paypalPayment(req, res, next));
router.post("/test", (req, res, next) => controller.testAdapter(req, res, next));

export default router;