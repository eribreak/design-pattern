import { Query } from "./QueryBus";

// User Queries
export class GetUserByIdQuery implements Query {
  constructor(public readonly type: string = "GET_USER_BY_ID", public readonly id: number) {}
}

export class GetUsersQuery implements Query {
  constructor(public readonly type: string = "GET_USERS", public readonly page?: number, public readonly limit?: number) {}
}

export class GetUserByEmailQuery implements Query {
  constructor(public readonly type: string = "GET_USER_BY_EMAIL", public readonly email: string) {}
}

// Product Queries
export class GetProductByIdQuery implements Query {
  constructor(public readonly type: string = "GET_PRODUCT_BY_ID", public readonly id: number) {}
}

export class GetProductsQuery implements Query {
  constructor(public readonly type: string = "GET_PRODUCTS") {}
}

// Order Queries
export class GetOrderByIdQuery implements Query {
  constructor(public readonly type: string = "GET_ORDER_BY_ID", public readonly id: number) {}
}

export class GetOrdersByUserIdQuery implements Query {
  constructor(public readonly type: string = "GET_ORDERS_BY_USER_ID", public readonly userId: number) {}
}

// Payment Queries
export class GetPaymentByIdQuery implements Query {
  constructor(public readonly type: string = "GET_PAYMENT_BY_ID", public readonly id: number) {}
}

export class GetPaymentsByUserIdQuery implements Query {
  constructor(public readonly type: string = "GET_PAYMENTS_BY_USER_ID", public readonly userId: number) {}
}