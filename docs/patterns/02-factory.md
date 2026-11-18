# Factory Pattern

## What is it?

The Factory Pattern defines an interface for creating objects, but lets subclasses decide which class to instantiate. It lets the factory method return different types.

## Problem it solves

- Encapsulates object creation logic
- Avoids `new` keyword scattered throughout code
- Enables creation of complex objects in one place
- Supports different product families

## Structure

```
Factory (EntityFactory)
    ├─ UserFactory
    ├─ ProductFactory
    └─ OrderFactory
```

## Implementation

### 1. Entity Factory Example
```typescript
export class UserFactory {
  create(data: { email: string; name: string; age?: number }): User {
    return {
      id: 0,
      email: data.email,
      name: data.name,
      age: data.age ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }
}
```

### 2. Registry Pattern (EntityFactory)
```typescript
export class EntityFactory {
  private static userFactory = new UserFactory();
  private static productFactory = new ProductFactory();

  static createUser(data: {...}): User {
    return this.userFactory.create(data);
  }

  static createProduct(data: {...}): Product {
    return this.productFactory.create(data);
  }

  static get factories() {
    return {
      user: this.userFactory,
      product: this.productFactory,
    };
  }
}
```

### 3. Builder Integration
The Factory can work with Builder:
```typescript
const user = this.userBuilder.reset()
  .withEmail(email)
  .withName(name)
  .build();
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/builder/user` | Build user via factory + builder |
| POST | `/patterns/builder/product` | Build product via factory + builder |
| POST | `/patterns/builder/order` | Build order via factory + builder |

## Key Benefits

1. **Centralized Creation**: All object creation in one place
2. **Consistent Objects**: Ensures proper initialization
3. **Test Data Generation**: Easy to create test fixtures
4. **Flexible Creation**: Can adapt creation process easily

## When to use

- When object creation is complex or requires configuration
- When you need to create related objects together
- When you want to encapsulate creation logic from clients

## Files

- `src/patterns/factory/index.ts` — EntityFactory registry
- `src/patterns/factory/UserFactory.ts` — User factory
- `src/patterns/factory/ProductFactory.ts` — Product factory
- `src/patterns/factory/OrderFactory.ts` — Order factory
- `src/patterns/factory/PaymentFactory.ts` — Payment factory