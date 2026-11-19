import { Router, Request, Response, NextFunction } from "express";
import { BuilderDirector } from "./BuilderDirector";
import { prisma } from "../../database/client";

const router = Router();
const director = new BuilderDirector();

export class BuilderController {
  async buildUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = director.buildUser("builder@example.com", "Builder User", 30);
      // Save to DB
      const createdUser = await prisma.user.create({ data: user });
      res.json({
        success: true,
        data: createdUser,
        pattern: "Builder",
        message: "User built using Builder pattern",
      });
    } catch (error) {
      next(error);
    }
  }

  async buildProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = director.buildProduct("Built Product", "A product built using Builder", 199.99, 100);
      const created = await prisma.product.create({ data: product });
      res.json({
        success: true,
        data: created,
        pattern: "Builder",
        message: "Product built using Builder pattern",
      });
    } catch (error) {
      next(error);
    }
  }

  async buildOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, items } = req.body;
      const orderData = director.buildProductOrder(userId, items);
      const created = await prisma.order.create({
        data: {
          userId: orderData.userId,
          status: orderData.status,
          total: orderData.total,
          items: { create: orderData.items },
        },
        include: { items: true },
      });
      res.json({
        success: true,
        data: created,
        pattern: "Builder",
        message: "Order built using Builder pattern",
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new BuilderController();
router.post("/user", (req, res, next) => controller.buildUser(req, res, next));
router.post("/product", (req, res, next) => controller.buildProduct(req, res, next));
router.post("/order", (req, res, next) => controller.buildOrder(req, res, next));

export default router;