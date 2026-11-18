import { IPaymentStrategy, PaymentResult } from "./IPaymentStrategy";

// Credit Card Strategy
export class CreditCardStrategy implements IPaymentStrategy {
  async process(amount: number): Promise<PaymentResult> {
    // Simulate credit card processing
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId: `cc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: "Credit card payment processed successfully",
    };
  }

  async refund(transactionId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId,
      message: "Credit card refund processed successfully",
    };
  }

  getName(): string {
    return "CREDIT_CARD";
  }
}

// PayPal Strategy
export class PayPalStrategy implements IPaymentStrategy {
  async process(amount: number): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      success: true,
      transactionId: `pp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: "PayPal payment processed successfully",
    };
  }

  async refund(transactionId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      success: true,
      transactionId,
      message: "PayPal refund processed successfully",
    };
  }

  getName(): string {
    return "PAYPAL";
  }
}

// Crypto Strategy
export class CryptoStrategy implements IPaymentStrategy {
  async process(amount: number): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      transactionId: `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: "Crypto payment processed successfully (simulated)",
    };
  }

  async refund(transactionId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      transactionId,
      message: "Crypto refund processed successfully (simulated)",
    };
  }

  getName(): string {
    return "CRYPTO";
  }
}

// Payment Context
export class PaymentContext {
  private strategy: IPaymentStrategy;

  constructor() {
    // Default strategy
    this.strategy = new CreditCardStrategy();
  }

  setStrategy(strategy: IPaymentStrategy): void {
    this.strategy = strategy;
  }

  async pay(amount: number, data?: Record<string, unknown>): Promise<PaymentResult> {
    return this.strategy.process(amount, data);
  }

  async refund(transactionId: string): Promise<PaymentResult> {
    return this.strategy.refund(transactionId);
  }

  getStrategyName(): string {
    return this.strategy.getName();
  }
}