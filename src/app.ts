import express, { Application } from "express";
import { json, urlencoded } from "body-parser";
import { errorHandler } from "./middleware/error-handler";

// Feature routes
import userRoutes from "./features/user/routes";
import productRoutes from "./features/product/routes";
import orderRoutes from "./features/order/routes";
import paymentRoutes from "./features/payment/routes";

// Pattern demo routes
import strategyRoutes from "./patterns/strategy/routes";
import observerRoutes from "./patterns/observer/routes";
import builderRoutes from "./patterns/builder/routes";
import adapterRoutes from "./patterns/adapter/routes";
import decoratorRoutes from "./patterns/decorator/routes";
import cqrsRoutes from "./patterns/cqrs/routes";
import circuitBreakerRoutes from "./patterns/circuit-breaker/routes";
import singletonRoutes from "./patterns/singleton/routes";

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ success: true, status: "ok" });
  });

  // API Routes
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);

  // Pattern demonstration routes
  app.get("/patterns/strategy", (_req, res) => {
    res.json({
      success: true,
      message: "Strategy Pattern - use POST /patterns/strategy/checkout",
    });
  });
  app.use("/patterns/strategy", strategyRoutes);

  app.get("/patterns/observer", (_req, res) => {
    res.json({
      success: true,
      message: "Observer Pattern - use POST /patterns/observer/notify",
    });
  });
  app.use("/patterns/observer", observerRoutes);

  app.get("/patterns/builder", (_req, res) => {
    res.json({
      success: true,
      message: "Builder Pattern - use POST /patterns/builder/user|product|order",
    });
  });
  app.use("/patterns/builder", builderRoutes);

  app.get("/patterns/adapter", (_req, res) => {
    res.json({
      success: true,
      message: "Adapter Pattern - use POST /patterns/adapter/mock|stripe|paypal|test",
    });
  });
  app.use("/patterns/adapter", adapterRoutes);

  app.get("/patterns/decorator", (_req, res) => {
    res.json({
      success: true,
      message: "Decorator Pattern - use GET /patterns/decorator/user/:id | /patterns/decorator/metrics",
    });
  });
  app.use("/patterns/decorator", decoratorRoutes);

  app.get("/patterns/cqrs", (_req, res) => {
    res.json({
      success: true,
      message: "CQRS Pattern - use POST /patterns/cqrs/command or POST /patterns/cqrs/query",
    });
  });
  app.use("/patterns/cqrs", cqrsRoutes);

  app.get("/patterns/circuit-breaker", (_req, res) => {
    res.json({
      success: true,
      message: "Circuit Breaker Pattern - use POST /patterns/circuit-breaker/safe-payment",
    });
  });
  app.use("/patterns/circuit-breaker", circuitBreakerRoutes);

  app.get("/patterns/singleton", (_req, res) => {
    res.json({
      success: true,
      message: "Singleton Pattern - use GET/POST /patterns/singleton/config|logger|log",
    });
  });
  app.use("/patterns/singleton", singletonRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}