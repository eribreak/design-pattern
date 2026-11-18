import { PaymentContext, CreditCardStrategy, PayPalStrategy, CryptoStrategy } from "../../src/patterns/strategy/strategy";

describe("Strategy Pattern", () => {
  let context: PaymentContext;

  beforeEach(() => {
    context = new PaymentContext();
  });

  describe("CreditCardStrategy", () => {
    it("should process credit card payment", async () => {
      context.setStrategy(new CreditCardStrategy());
      const result = await context.pay(100);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.message).toContain("Credit card");
    });

    it("should refund credit card payment", async () => {
      context.setStrategy(new CreditCardStrategy());
      const refund = await context.refund("txn_123");

      expect(refund.success).toBe(true);
      expect(refund.message).toContain("refund");
    });
  });

  describe("PayPalStrategy", () => {
    it("should process PayPal payment", async () => {
      context.setStrategy(new PayPalStrategy());
      const result = await context.pay(200);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.message).toContain("PayPal");
    });
  });

  describe("CryptoStrategy", () => {
    it("should process crypto payment", async () => {
      context.setStrategy(new CryptoStrategy());
      const result = await context.pay(500);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Crypto");
      expect(result.message).toContain("simulated");
    });
  });

  describe("PaymentContext", () => {
    it("should change strategy dynamically", async () => {
      // Start with credit card
      context.setStrategy(new CreditCardStrategy());
      let result = await context.pay(100);
      expect(result.message).toContain("Credit card");

      // Switch to PayPal
      context.setStrategy(new PayPalStrategy());
      result = await context.pay(200);
      expect(result.message).toContain("PayPal");

      // Switch to Crypto
      context.setStrategy(new CryptoStrategy());
      result = await context.pay(300);
      expect(result.message).toContain("Crypto");
    });

    it("should return current strategy name", () => {
      context.setStrategy(new CreditCardStrategy());
      expect(context.getStrategyName()).toBe("CREDIT_CARD");

      context.setStrategy(new PayPalStrategy());
      expect(context.getStrategyName()).toBe("PAYPAL");

      context.setStrategy(new CryptoStrategy());
      expect(context.getStrategyName()).toBe("CRYPTO");
    });
  });
});