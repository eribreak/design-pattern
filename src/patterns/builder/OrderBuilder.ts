import { Order } from "@prisma/client";

export interface OrderBuilderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export class OrderBuilder {
  private order: Partial<Order> = {};
  private items: OrderBuilderItem[] = [];

  withId(id: number): OrderBuilder {
    this.order.id = id;
    return this;
  }

  withUserId(userId: number): OrderBuilder {
    this.order.userId = userId;
    return this;
  }

  withStatus(status: string): OrderBuilder {
    this.order.status = status;
    return this;
  }

  withTotal(total: number): OrderBuilder {
    this.order.total = total;
    return this;
  }

  withItem(item: OrderBuilderItem): OrderBuilder {
    this.items.push(item);
    return this;
  }

  withItems(items: OrderBuilderItem[]): OrderBuilder {
    this.items = [...this.items, ...items];
    return this;
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  build(): Omit<Order, "id"> & { userId: number; status: string; total: number; items: OrderBuilderItem[] } {
    const total = this.calculateTotal();
    return {
      userId: this.order.userId!,
      status: this.order.status || "PENDING",
      total,
      items: this.items,
      createdAt: this.order.createdAt ?? new Date(),
      updatedAt: this.order.updatedAt ?? new Date(),
    };
  }

  reset(): OrderBuilder {
    this.order = {};
    this.items = [];
    return this;
  }
}