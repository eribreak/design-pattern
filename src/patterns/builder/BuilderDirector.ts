import { UserBuilder } from "./UserBuilder";
import { OrderBuilder, OrderBuilderItem } from "./OrderBuilder";
import { ProductBuilder } from "./ProductBuilder";

export class BuilderDirector {
  private userBuilder = new UserBuilder();
  private orderBuilder = new OrderBuilder();
  private productBuilder = new ProductBuilder();

  // Build standard user
  buildUser(email: string, name: string, age?: number): { email: string; name: string; age: number | null } {
    return this.userBuilder.reset()
      .withEmail(email)
      .withName(name)
      .withAge(age!)
      .build();
  }

  // Build product order
  buildProductOrder(userId: number, items: OrderBuilderItem[]): { userId: number; status: string; total: number; items: OrderBuilderItem[] } {
    return this.orderBuilder.reset()
      .withUserId(userId)
      .withItems(items)
      .build();
  }

  // Build simple order
  buildSimpleOrder(userId: number): { userId: number; status: string; total: number; items: OrderBuilderItem[] } {
    return this.orderBuilder.reset()
      .withUserId(userId)
      .withStatus("PENDING")
      .build();
  }

  // Build product
  buildProduct(name: string, description: string, price: number, stock: number): { name: string; description: string; price: number; stock: number } {
    return this.productBuilder.reset()
      .withName(name)
      .withDescription(description)
      .withPrice(price)
      .withStock(stock)
      .build();
  }
}