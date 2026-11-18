import { Router, Request, Response, NextFunction } from "express";
import { NotificationSubject } from "./Subject";
import { EmailObserver, SmsObserver, SlackObserver, ConsoleObserver } from "./observers";
import { prisma } from "../../database/client";
import { OrderRepository } from "../../patterns/repository/OrderRepository";

const router = Router();
const orderRepository = new OrderRepository(prisma);

// Create the notification subject (Observer pattern)
const notificationSubject = new NotificationSubject();

// Subscribe observers
notificationSubject.attach(new EmailObserver());
notificationSubject.attach(new SmsObserver());
notificationSubject.attach(new SlackObserver());
notificationSubject.attach(new ConsoleObserver());

export class ObserverController {
  async notifyOrderCreated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.body;

      const order = await orderRepository.findById(orderId);
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      await notificationSubject.notify("ORDER_CREATED", {
        orderId,
        userId: order.userId,
        message: `Order #${orderId} created`,
      });

      res.json({
        success: true,
        message: `Notifications sent for order ${orderId}`,
        observers: ["Email", "SMS", "Slack", "Console"],
      });
    } catch (error) {
      next(error);
    }
  }

  async simulateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.body;

      await notificationSubject.notify("ORDER_UPDATED", {
        orderId,
        userId: 1,
        status: "CONFIRMED",
        message: `Order #${orderId} status updated`,
      });

      res.json({
        success: true,
        message: `Event NOTIFIED for order ${orderId}`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Add observer dynamically
  async addObserver(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type } = req.body; // "email" | "sms" | "slack" | "console"

      let observer: any;
      switch (type.toLowerCase()) {
        case "email":
          observer = new EmailObserver();
          break;
        case "sms":
          observer = new SmsObserver();
          break;
        case "slack":
          observer = new SlackObserver();
          break;
        case "console":
          observer = new ConsoleObserver();
          break;
        default:
          res.status(400).json({ success: false, error: "Invalid observer type" });
          return;
      }

      notificationSubject.attach(observer);

      res.json({
        success: true,
        message: `Observer ${type.toUpperCase()} attached`,
      });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new ObserverController();
router.post("/notify", (req, res, next) => controller.notifyOrderCreated(req, res, next));
router.post("/simulate", (req, res, next) => controller.simulateEvent(req, res, next));
router.post("/add-observer", (req, res, next) => controller.addObserver(req, res, next));

export default router;