import { User, Product, Order, Payment } from "@prisma/client";
import { UserFactory } from "./UserFactory";
import { ProductFactory } from "./ProductFactory";
import { OrderFactory } from "./OrderFactory";
import { PaymentFactory } from "./PaymentFactory";

// EntityFactory - Registry pattern with Factory
export class EntityFactory {
  private static userFactory = new UserFactory();
  private static productFactory = new ProductFactory();
  private static orderFactory = new OrderFactory();
  private static paymentFactory = new PaymentFactory();

  static createUser(data: { email: string; name: string; age?: number }): User {
    return this.userFactory.create(data);
  }

  static createProduct(data: { name: string; description: string; price: number; stock: number }): Product {
    return this.productFactory.create(data);
  }

  static createOrder(data: { userId: number; status: string; total: number; items?: any[] }): Order {
    return this.orderFactory.create(data);
  }

  static createPayment(data: { userId: number; orderId: number | null; amount: number; method: string; status?: string }): Payment {
    return this.paymentFactory.create(data);
  }

  static get factories() {
    return {
      user: this.userFactory,
      product: this.productFactory,
      order: this.orderFactory,
      payment: this.paymentFactory,
    };
  }
}