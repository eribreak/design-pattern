import { Router, Request, Response, NextFunction } from "express";
import { CommandBus } from "./CommandBus";
import { QueryBus } from "./QueryBus";
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand, CreateOrderCommand, ProcessPaymentCommand } from "./commands";
import { GetUserByIdQuery, GetUsersQuery, GetOrdersByUserIdQuery, GetPaymentsByUserIdQuery } from "./queries";
import { prisma } from "../../database/client";
import { UserRepository } from "../repository/UserRepository";
import { OrderRepository } from "../repository/OrderRepository";
import { PaymentRepository } from "../repository/PaymentRepository";

const router = Router();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

const userRepository = new UserRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const paymentRepository = new PaymentRepository(prisma);

// Register Command Handlers
commandBus.register("CREATE_USER", async (cmd: CreateUserCommand) => {
  await userRepository.create({ email: cmd.email, name: cmd.name, age: cmd.age });
});

commandBus.register("UPDATE_USER", async (cmd: UpdateUserCommand) => {
  await userRepository.update(cmd.id, { name: cmd.name, age: cmd.age });
});

commandBus.register("DELETE_USER", async (cmd: DeleteUserCommand) => {
  await userRepository.delete(cmd.id);
});

commandBus.register("CREATE_ORDER", async (cmd: CreateOrderCommand) => {
  const total = cmd.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  await orderRepository.create({ userId: cmd.userId, status: "PENDING", total, items: cmd.items });
});

commandBus.register("PROCESS_PAYMENT", async (cmd: ProcessPaymentCommand) => {
  await paymentRepository.create({ userId: cmd.userId, orderId: cmd.orderId, amount: cmd.amount, method: cmd.method });
});

// Register Query Handlers
queryBus.register("GET_USER_BY_ID", async (query: GetUserByIdQuery) => {
  return await userRepository.findById(query.id);
});

queryBus.register("GET_USERS", async (query: GetUsersQuery) => {
  return await userRepository.findAll(query.page, query.limit);
});

queryBus.register("GET_ORDERS_BY_USER_ID", async (query: GetOrdersByUserIdQuery) => {
  return await orderRepository.findByUserId(query.userId);
});

queryBus.register("GET_PAYMENTS_BY_USER_ID", async (query: GetPaymentsByUserIdQuery) => {
  return await paymentRepository.findByUserId(query.userId);
});

export class CqrsController {
  async executeCommand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, ...payload } = req.body;
      let command: any;

      switch (type) {
        case "CREATE_USER":
          command = new CreateUserCommand(type, payload.email, payload.name, payload.age);
          break;
        case "UPDATE_USER":
          command = new UpdateUserCommand(type, payload.id, payload.name, payload.age);
          break;
        case "DELETE_USER":
          command = new DeleteUserCommand(type, payload.id);
          break;
        case "CREATE_ORDER":
          command = new CreateOrderCommand(type, payload.userId, payload.items);
          break;
        case "PROCESS_PAYMENT":
          command = new ProcessPaymentCommand(type, payload.userId, payload.orderId, payload.amount, payload.method);
          break;
        default:
          res.status(400).json({ success: false, error: "Unknown command type" });
          return;
      }

      await commandBus.dispatch(command);
      res.json({ success: true, message: `Command ${type} executed` });
    } catch (error) {
      next(error);
    }
  }

  async executeQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, ...payload } = req.body;

      if (type === "GET_USER_BY_ID") {
        const result = await queryBus.dispatch(new GetUserByIdQuery(type, payload.id));
        res.json({ success: true, data: result });
        return;
      }
      if (type === "GET_USERS") {
        const result = await queryBus.dispatch(new GetUsersQuery(type, payload.page, payload.limit));
        res.json({ success: true, data: result });
        return;
      }
      if (type === "GET_ORDERS_BY_USER_ID") {
        const result = await queryBus.dispatch(new GetOrdersByUserIdQuery(type, payload.userId));
        res.json({ success: true, data: result });
        return;
      }
      if (type === "GET_PAYMENTS_BY_USER_ID") {
        const result = await queryBus.dispatch(new GetPaymentsByUserIdQuery(type, payload.userId));
        res.json({ success: true, data: result });
        return;
      }

      res.status(400).json({ success: false, error: "Unknown query type" });
    } catch (error) {
      next(error);
    }
  }
}

const controller = new CqrsController();
router.post("/command", (req, res, next) => controller.executeCommand(req, res, next));
router.post("/query", (req, res, next) => controller.executeQuery(req, res, next));

export default router;