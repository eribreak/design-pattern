# Adapter Pattern

## What is it?

The Adapter Pattern converts the interface of a class into another interface clients expect. It's also known as the "Wrapper" pattern.

## Problem it solves

- Integrate incompatible interfaces
- Work with legacy code or external libraries
- Allow substitution of different implementations
- Bridge gap between two systems

## Structure

```
Client → Target Interface (IPaymentGateway)
               │
               └─ Adapter (StripeAdapter) → Adaptee (Stripe SDK)
```

## Implementation

### 1. Target Interface
```typescript
export interface IPaymentGateway {
  charge(amount: number, data?: Record<string, unknown>): Promise<PaymentResult>;
  refund(transactionId: string): Promise<PaymentGatewayResult>;
  getProviderName(): string;
}
```

### 2. Adaptee (External API)
```typescript
// Simulated Stripe API
class StripeAPI {
  async charges(): Promise<{ create: (data: any) => Promise<{ id: string }> }> {
    return {
      create: async (data) => ({ id: `stripe_${Date.now()}`, status: "succeeded" }),
    };
  }
}
```

### 3. Adapter Implementation
```typescript
export class StripeAdapter implements IPaymentGateway {
  private stripe: StripeAPI;

  constructor() {
    this.stripe = new StripeAPI();
  }

  async charge(amount: number, data?: Record<string, unknown>): Promise<PaymentResult> {
    const charge = await this.stripe.charges();
    const result = await charge.create({
      amount,
      currency: "usd",
      source: data?.token,
    });

    return {
      success: true,
      transactionId: result.id,
      message: "Stripe charge processed",
    };
  }

  getProviderName(): string {
    return "Stripe";
  }
}
```

### 4. Factory for Adapters
```typescript
export class PaymentGatewayFactory {
  static create(type: "STRIPE" | "PAYPAL" | "MOCK"): IPaymentGateway {
    switch (type) {
      case "STRIPE":
        return new StripeAdapter();
      case "PAYPAL":
        return new PayPalAdapter();
      case "MOCK":
      default:
        return new MockAdapter();
    }
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/adapter/mock` | Mock gateway payment |
| POST | `/patterns/adapter/stripe` | Stripe gateway payment |
| POST | `/patterns/adapter/paypal` | PayPal gateway payment |
| POST | `/patterns/adapter/test` | Test gateway with type param |

## Example Request

```bash
curl -X POST http://localhost:3000/patterns/adapter/mock \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

## Key Benefits

1. **Interface Compatibility**: Makes incompatible interfaces work together
2. **Transparency**: Client code doesn't know about adaptation
3. **Easy Testing**: Use MockAdapter for tests
4. **Future-Proof**: Easy to add new external services

## When to use

- Integrating third-party libraries
- Working with legacy systems
- Need multiple implementations of same interface
- Testing with mock implementations

## Files

- `src/patterns/adapter/IPaymentGateway.ts` — Target interface
- `src/patterns/adapter/adapters.ts` — Concrete adapters (Stripe, PayPal, Mock)
- `src/patterns/adapter/routes.ts` — API endpoints