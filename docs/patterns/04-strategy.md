# Strategy Pattern

## What is it?

The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

## Problem it solves

- Multiple ways to perform the same operation
- Need to switch algorithms at runtime
- Avoid conditional statements (`if/else` or `switch`)
- Enable easy addition of new algorithms

## Structure

```
Strategy Interface (IPaymentStrategy)
    ├─ CreditCardStrategy
    ├─ PayPalStrategy
    └─ CryptoStrategy
```

## Implementation

### 1. Strategy Interface
```typescript
export interface IPaymentStrategy {
  process(amount: number, data?: Record<string, unknown>): Promise<PaymentResult>;
  refund(transactionId: string): Promise<PaymentResult>;
  getName(): string;
}
```

### 2. Concrete Strategies
```typescript
export class CreditCardStrategy implements IPaymentStrategy {
  async process(amount: number): Promise<PaymentResult> {
    // Credit card processing logic
    return {
      success: true,
      transactionId: `cc_${Date.now()}`,
      message: "Credit card payment processed",
    };
  }

  getName(): string {
    return "CREDIT_CARD";
  }
}
```

### 3. Context
```typescript
export class PaymentContext {
  private strategy: IPaymentStrategy;

  setStrategy(strategy: IPaymentStrategy): void {
    this.strategy = strategy;
  }

  async pay(amount: number): Promise<PaymentResult> {
    return this.strategy.process(amount);
  }
}
```

### 4. Runtime Selection
```typescript
const context = new PaymentContext();

// Switch strategy based on user choice
switch (method) {
  case "CREDIT_CARD":
    context.setStrategy(new CreditCardStrategy());
    break;
  case "PAYPAL":
    context.setStrategy(new PayPalStrategy());
    break;
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/strategy/checkout` | Process payment with selectable strategy |

## Example Request

```bash
curl -X POST http://localhost:3000/patterns/strategy/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 100, "method": "CREDIT_CARD"}'
```

## Key Benefits

1. **Runtime Flexibility**: Choose algorithm at runtime
2. **No Conditional Logic**: Eliminates complex if/else chains
3. **Easy Extension**: Add new strategies without modifying existing code
4. **Testability**: Test each strategy independently

## When to use

- Multiple algorithms for the same operation
- Strategy selection based on user input or config
- When you want to avoid large conditional statements

## Files

- `src/patterns/strategy/IPaymentStrategy.ts` — Strategy interface
- `src/patterns/strategy/strategy.ts` — Concrete strategies
- `src/patterns/strategy/routes.ts` — API endpoint