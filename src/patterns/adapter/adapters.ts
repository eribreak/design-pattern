import { IPaymentGateway, PaymentGatewayResult } from "./IPaymentGateway";

// StripeAdapter - simplified adapter for Stripe-like API
export class StripeAdapter implements IPaymentGateway {
  async charge(amount: number, data?: Record<string, unknown>): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 80));
    return {
      success: true,
      transactionId: `stripe_${Date.now()}`,
      message: "Stripe charge processed",
    };
  }

  async refund(transactionId: string): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 80));
    return {
      success: true,
      transactionId: `stripe_refund_${Date.now()}`,
      message: "Stripe refund processed",
    };
  }

  getProviderName(): string {
    return "Stripe";
  }
}

// PayPalAdapter - for PayPal
export class PayPalAdapter implements IPaymentGateway {
  async charge(amount: number, data?: Record<string, unknown>): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId: `paypal_${Date.now()}`,
      message: "PayPal charge processed",
    };
  }

  async refund(transactionId: string): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId: `paypal_refund_${Date.now()}`,
      message: "PayPal refund processed",
    };
  }

  getProviderName(): string {
    return "PayPal";
  }
}

// CryptoAdapter - for cryptocurrency
export class CryptoAdapter implements IPaymentGateway {
  async charge(amount: number, data?: Record<string, unknown>): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      success: true,
      transactionId: `crypto_${Date.now()}`,
      message: "Crypto payment processed (simulated)",
    };
  }

  async refund(transactionId: string): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      success: true,
      transactionId: `crypto_refund_${Date.now()}`,
      message: "Crypto refund processed (simulated)",
    };
  }

  getProviderName(): string {
    return "Crypto";
  }
}

// MockAdapter - for testing/development
export class MockAdapter implements IPaymentGateway {
  async charge(amount: number, data?: Record<string, unknown>): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 20));
    return {
      success: true,
      transactionId: `mock_${Date.now()}`,
      message: "Mock payment processed",
    };
  }

  async refund(transactionId: string): Promise<PaymentGatewayResult> {
    await new Promise(resolve => setTimeout(resolve, 20));
    return {
      success: true,
      transactionId: `mock_refund_${Date.now()}`,
      message: "Mock refund processed",
    };
  }

  getProviderName(): string {
    return "Mock";
  }
}

// Payment Gateway Factory (combination with Factory)
export class PaymentGatewayFactory {
  static create(type: "STRIPE" | "PAYPAL" | "MOCK" | "CRYPTO"): IPaymentGateway {
    switch (type) {
      case "STRIPE":
        return new StripeAdapter();
      case "PAYPAL":
        return new PayPalAdapter();
      case "CRYPTO":
        return new CryptoAdapter();
      case "MOCK":
      default:
        return new MockAdapter();
    }
  }
}

// Re-export types for convenience
export { IPaymentGateway, PaymentGatewayResult };