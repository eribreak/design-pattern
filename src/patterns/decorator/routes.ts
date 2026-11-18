import { Router, Request, Response, NextFunction } from "express";
import { userDecorator } from "./repo-factory";

const router = Router();

export class DecoratorController {
  async getUserWithDecorators(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await userDecorator.findById(id);
      const metrics = (userDecorator as any).getMetrics?.() || {};

      res.json({
        success: true,
        data: user,
        metrics,
        message: "User retrieved using decorated Repository (Logging + Metrics + Caching)",
      });
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = (userDecorator as any).getMetrics?.() || {};

      res.json({
        success: true,
        metrics,
        message: "Metrics collected via Decorator pattern",
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new DecoratorController();
router.get("/user/:id", (req, res, next) => controller.getUserWithDecorators(req, res, next));
router.get("/metrics", (req, res, next) => controller.getMetrics(req, res, next));

export default router;