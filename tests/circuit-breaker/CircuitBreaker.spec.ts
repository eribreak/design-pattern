import { CircuitBreaker, CircuitState } from "../../src/patterns/circuit-breaker/CircuitBreaker";

describe("Circuit Breaker Pattern", () => {
  let breaker: CircuitBreaker<string>;

  beforeEach(() => {
    breaker = new CircuitBreaker<string>({
      failureThreshold: 2,
      resetTimeout: 1000,
    });
  });

  describe("CLOSED state (normal)", () => {
    it("should execute function when closed", async () => {
      const result = await breaker.execute(async () => "success");
      expect(result).toBe("success");
      expect(breaker.getState()).toBe(CircuitState.CLOSED);
    });
  });

  describe("OPEN state (failure protection)", () => {
    it("should open after threshold failures", async () => {
      // First failure
      await expect(breaker.execute(() => Promise.throw(new Error("fail")))).rejects.toThrow("fail");
      expect(breaker.getFailureCount()).toBe(1);
      expect(breaker.getState()).toBe(CircuitState.CLOSED);

      // Second failure - should open
      await expect(breaker.execute(() => Promise.throw(new Error("fail")))).rejects.toThrow("fail");
      expect(breaker.getFailureCount()).toBe(2);
      expect(breaker.getState()).toBe(CircuitState.OPEN);
    });

    it("should reject immediately when open", async () => {
      // Force open state
      (breaker as any).failureCount = 3;
      (breaker as any).lastFailureTime = Date.now();

      await expect(breaker.execute(async () => "success")).rejects.toThrow("OPEN");
    });
  });

  describe("HALF_OPEN state (recovery)", () => {
    it("should transition to HALF_OPEN after reset timeout", async () => {
      // Open the circuit
      (breaker as any).failureCount = 3;
      (breaker as any).lastFailureTime = Date.now() - 2000; // Expired

      // Should transition to HALF_OPEN and try
      await breaker.execute(async () => "success");
      expect(breaker.getState()).toBe(CircuitState.CLOSED); // Success, so closed again
    });
  });

  describe("reset", () => {
    it("should reset to CLOSED state", () => {
      breaker.reset();
      expect(breaker.getState()).toBe(CircuitState.CLOSED);
      expect(breaker.getFailureCount()).toBe(0);
    });
  });
});