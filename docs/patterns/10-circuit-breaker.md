# Circuit Breaker Pattern

## What is it?

The Circuit Breaker Pattern prevents cascading failures by stopping requests to a failing service, allowing it time to recover.

## Problem it solves

- Cascading failures in distributed systems
- Slow/dead services blocking your application
- Too many failed requests overwhelming a service
- Need graceful degradation

## Structure

```
Closed (normal) ──failures──► Open (rejects)
    │                           │
    │ success                   │ timeout
    └───────────reset───────────┘
                    │
                    ▼
              Half-Open (test) ──success──► Closed
                    │
                    └─failure──► Open
```

## Implementation

### 1. Circuit States
```typescript
export enum CircuitState {
  CLOSED = "CLOSED",      // Normal operation
  OPEN = "OPEN",          // Rejecting requests
  HALF_OPEN = "HALF_OPEN", // Testing if service recovered
}
```

### 2. Circuit Breaker Class
```typescript
export class CircuitBreaker<T> {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime: number = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThreshold: config?.failureThreshold ?? 3,
      resetTimeout: config?.resetTimeout ?? 10000,
    };
  }

  async execute(fn: () => Promise<T>): Promise<T> {
    this.checkState(); // Check if we can proceed

    try {
      const result = await fn();
      this.onSuccess(); // Reset failure count
      return result;
    } catch (error) {
      this.onFailure(); // Increment failure count
      throw error;
    }
  }

  private checkState(): void {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}
```

### 3. Usage
```typescript
const breaker = new CircuitBreaker<SomeResult>({
  failureThreshold: 3,
  resetTimeout: 5000,  // 5 seconds
});

try {
  const result = await breaker.execute(() => externalService.call());
  // Success!
} catch (error) {
  if (error.message.includes("OPEN")) {
    // Circuit is open, use fallback
    console.log("Service unavailable, using fallback");
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/circuit-breaker/safe-payment` | Protected payment call |
| GET | `/patterns/circuit-breaker/state` | Get circuit state |
| POST | `/patterns/circuit-breaker/reset` | Manually reset circuit |

## Key Benefits

1. **Failure Isolation**: Stop cascading failures
2. **Graceful Degradation**: Fallback when service unavailable
3. **Automatic Recovery**: Service gets time to heal
4. **Configurable**: Tune thresholds and timeouts

## When to use

- External API calls
- Microservice communication
- Any unreliable dependency
- Prevent overload during issues

## Configuration

| Setting | Recommended | Purpose |
|---------|-------------|---------|
| failureThreshold | 3-5 | How many failures before opening |
| resetTimeout | 10-60s | How long to stay open |
| timeout | 3-5s | How long to wait for each call |

## Files

- `src/patterns/circuit-breaker/CircuitBreaker.ts` — Core implementation
- `src/patterns/circuit-breaker/routes.ts` — API endpoints
- `src/shared/errors.ts` — CircuitBreakerOpenError