import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/client";
import { OrderRepository } from "../../patterns/repository/OrderRepository";
import { PaymentRepository } from "../../patterns/repository/PaymentRepository";
import { CreateOrderDto, UpdateOrderDto, OrderResponse, OrderStatus } from "./dto";
import { OrderFactory } from "../../patterns/factory/OrderFactory";
import { calculateTotal } from "../../shared/utils";

const orderRepository = new OrderRepository(prisma);
const paymentRepository = new PaymentRepository(prisma);
const orderFactory = new OrderFactory();

function mapToOrderResponse(order: any): OrderResponse {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items?.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || [],
  };
}

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, items }: CreateOrderDto = req.body;
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: (item as any).unitPrice ?? 0,
      }));
      const total = orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const order = await orderRepository.create({ userId, status: OrderStatus.PENDING, total, items: orderItems });
      res.status(201).json({ success: true, data: mapToOrderResponse(order) });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await orderRepository.findByStatus("PENDING");
      res.json({ success: true, data: orders.map(mapToOrderResponse) });
    } catch (error) {
      next(error);
    }
  }

  async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await orderRepository.findByUserId(Number(req.params.userId));
      res.json({ success: true, data: orders.map(mapToOrderResponse) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderRepository.findById(Number(req.params.id));
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      res.json({ success: true, data: mapToOrderResponse(order) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status }: UpdateOrderDto = req.body;
      const order = await orderRepository.update(Number(req.params.id), { status });
      res.json({ success: true, data: mapToOrderResponse(order) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await orderRepository.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}