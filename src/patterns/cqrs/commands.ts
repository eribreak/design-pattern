import { Command } from "./CommandBus";

// User Commands
export class CreateUserCommand implements Command {
  constructor(
    public readonly type: string = "CREATE_USER",
    public readonly email: string,
    public readonly name: string,
    public readonly age?: number
  ) {}
}

export class UpdateUserCommand implements Command {
  constructor(
    public readonly type: string = "UPDATE_USER",
    public readonly id: number,
    public readonly name?: string,
    public readonly age?: number
  ) {}
}

export class DeleteUserCommand implements Command {
  constructor(
    public readonly type: string = "DELETE_USER",
    public readonly id: number
  ) {}
}

// Product Commands
export class CreateProductCommand implements Command {
  constructor(
    public readonly type: string = "CREATE_PRODUCT",
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number
  ) {}
}

export class UpdateProductCommand implements Command {
  constructor(
    public readonly type: string = "UPDATE_PRODUCT",
    public readonly id: number,
    public readonly name?: string,
    public readonly description?: string,
    public readonly price?: number,
    public readonly stock?: number
  ) {}
}

export class DeleteProductCommand implements Command {
  constructor(
    public readonly type: string = "DELETE_PRODUCT",
    public readonly id: number
  ) {}
}

// Order Commands
export class CreateOrderCommand implements Command {
  constructor(
    public readonly type: string = "CREATE_ORDER",
    public readonly userId: number,
    public readonly items: { productId: number; quantity: number; unitPrice: number }[]
  ) {}
}

export class UpdateOrderStatusCommand implements Command {
  constructor(
    public readonly type: string = "UPDATE_ORDER_STATUS",
    public readonly id: number,
    public readonly status: string
  ) {}
}

// Payment Commands
export class ProcessPaymentCommand implements Command {
  constructor(
    public readonly type: string = "PROCESS_PAYMENT",
    public readonly userId: number,
    public readonly orderId: number | null,
    public readonly amount: number,
    public readonly method: "CREDIT_CARD" | "PAYPAL" | "CRYPTO"
  ) {}
}