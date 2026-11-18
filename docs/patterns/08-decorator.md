# Decorator Pattern

## What is it?

The Decorator Pattern attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

## Problem it solves

- Add behavior without modifying original class
- Stack multiple behaviors (Logging + Caching + Metrics)
- Runtime composition of features
- Avoid class explosion from multiple inheritance

## Structure

```
Component (IUser)
    │
    └─ Base Component (UserRepository)
            │
            └─ Decorators
                 │
                 ├─ LoggingDecorator
                 ├─ CachingDecorator
                 └─ MetricsDecorator
```

## Implementation

### 1. Component Interface
```typescript
export interface IUser {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: {...}): Promise<User>;
  update(id: number, data: {...}): Promise<User>;
  delete(id: number): Promise<void>;
}
```

### 2. Base Component
```typescript
export class UserRepository implements IUser {
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // ... other methods
}
```

### 3. Base Decorator
```typescript
export abstract class BaseUserDecorator implements IUser {
  protected decoratedUser: IUser;

  constructor(decoratedUser: IUser) {
    this.decoratedUser = decoratedUser;
  }

  async findById(id: number): Promise<User | null> {
    return this.decoratedUser.findById(id);
  }
  // ... delegates to decorated object
}
```

### 4. Concrete Decorator
```typescript
export class LoggingDecorator extends BaseUserDecorator {
  async findById(id: number): Promise<User | null> {
    logger.info("findById", { id });
    const result = await this.decoratedUser.findById(id);
    logger.info("findById result", { found: !!result });
    return result;
  }
}
```

### 5. Stacking Decorators
```typescript
const repository = new MetricsDecorator(
  new LoggingDecorator(
    new CachingDecorator(baseUserRepository)
  )
);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patterns/decorator/user/:id` | User with decorators |
| GET | `/patterns/decorator/metrics` | Get metrics from decorator |

## Key Benefits

1. **Runtime Composition**: Add/remove behaviors dynamically
2. **Single Responsibility**: Each decorator does one thing
3. **Transparency**: Client sees same interface
4. **Stackable**: Chain decorators in any order

## When to use

- Add cross-cutting concerns (logging, caching, metrics)
- Extend functionality without modifying original code
- Need flexible feature combination
- AOP-like behavior in vanilla TypeScript

## Files

- `src/patterns/decorator/IUser.ts` — Component interface
- `src/patterns/decorator/BaseDecorator.ts` — Base decorator
- `src/patterns/decorator/decorators.ts` — Logging, Caching, Metrics decorators
- `src/patterns/decorator/routes.ts` — API endpoints
- `src/patterns/decorator/repo-factory.ts` — Registry with stacked decorators

## Common Decorator Types

| Decorator | Purpose |
|-----------|---------|
| Logging | Log method calls and results |
| Caching | Cache results for repeated calls |
| Metrics | Track call counts and timing |
| Retry | Retry failed operations |
| Transaction | Wrap operations in transactions |
| Validation | Validate inputs before processing