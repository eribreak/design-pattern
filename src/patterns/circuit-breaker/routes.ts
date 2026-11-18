import { Router, Request, Response, NextFunction } from "express";
import { CircuitBreaker, CircuitState } from "./CircuitBreaker";

const router = Router();

// Demo Circuit Breaker that wraps simulated external service calls
class ExternalPaymentService {
  async processPayment(amount: number): Promise<{ success: boolean; transactionId?: string }> {
    // Simulate random failures
    const success = Math.random() > 0.3;
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!success) {
      throw new Error("External payment service failed");
    }

    return {
      success: true,
      transactionId: `ext_${Date.now()}`,
    };
  }
}

const service = new ExternalPaymentService();
const circuitBreaker = new CircuitBreaker<{ success: boolean; transactionId?: string }>({
  failureThreshold: 3,
  resetTimeout: 10000,
});

export class CircuitBreakerController {
  async safePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount = 100 } = req.body;
      const result = await circuitBreaker.execute(() => service.processPayment(amount));

      res.json({
        success: true,
        data: result,
        circuitState: circuitBreaker.getState(),
        failureCount: circuitBreaker.getFailureCount(),
      });
    } catch (error: any) {
      if (error.message?.includes("Circuit breaker is OPEN")) {
        res.status(503).json({
          success: false,
          error: error.message,
          circuitState: circuitBreaker.getState(),
        });
        return;
      }
      next(error);
    }
  }

  async getState(req: Request, res: Response): Promise<void> {
    res.json({
      state: circuitBreaker.getState(),
      failureCount: circuitBreaker.getFailureCount(),
    });
  }

  async reset(req: Request, res: Response): Promise<void> {
    circuitBreaker.reset();
    res.json({
      success: true,
      message: "Circuit breaker reset",
      state: circuitBreaker.getState(),
    });
  }
}

const controller = new CircuitBreakerController();
router.post("/safe-payment", (req, res, next) => controller.safePayment(req, res, next));
router.get("/state", (req, res) => controller.getState(req, res));
router.post("/reset", (req, res) => controller.reset(req, res));

export default router;